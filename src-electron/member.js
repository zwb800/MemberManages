import { ObjectId } from 'bson'
import { contextBridge } from 'electron'

import {connect} from './db'

contextBridge.exposeInMainWorld('memberAPI', {
    
    get:async(id)=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        const balances = db.collection('Balance')
        const serviceItems = db.collection('ServiceItem')
        
        const m = await members.findOne({_id:ObjectId.createFromHexString(id)}) 

        const arrBalances = await balances.find({memberId:m._id}).toArray()
        const sItems = await serviceItems.find({_id:{$in:arrBalances.map(p=>p.serviceItemId)}}).toArray()

        const arrB = arrBalances.map(p=>{
            const s = sItems.find(s=>s._id.toString() == p.serviceItemId.toString())
            return {
                serviceItemName:s.name,
                balance:p.balance
            }
        })
        await mongoClient.close()
        return {
            member:m,
            balances:arrB
        }
    },
    all:async (keyword)=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        
        const cursor = members.find({$or:[{name:{$regex:keyword}},{phone:{$regex:keyword}}]},{
            sort:{no:-1}
        })
        const arr = await cursor.toArray()
        arr.forEach(v=>v._id = v._id.toString())
        await mongoClient.close()
        return arr
        
    },
    getChargeList:async(memberId)=>{
        memberId = ObjectId.createFromHexString(memberId)
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const chargeItem = db.collection('ChargeItem')
        const cards = await db.collection('PrepaidCard')

        const arrCards = await cards.find().toArray()
        const citems = await chargeItem.find({memberId:memberId},{sort:{time:-1}}).toArray()
        return citems.map(c=>{
            let card 
            if(c.itemId)
              card = arrCards.find(ac=>ac._id.toString() == c.itemId.toString())
            return {
                time:c.time,
                balance:c.balance,
                pay:c.pay,
                amount:c.amount,
                card:card?card.label:null,
            }
        })
    },
    charge:async(memberId,amount,item,employees)=>{
        item = item?ObjectId.createFromHexString(item._id):item
        employees = employees.map(it=>ObjectId.createFromHexString(it._id))
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        const cards = await db.collection('PrepaidCard')
        const balances = db.collection('Balance')
        const chargeItem = db.collection('ChargeItem')

        const m = await members.findOne({_id:ObjectId.createFromHexString(memberId)}) 
      
        const prepayCards = await cards.find({ _id:item }).toArray()
        let balance = amount
        let pay = amount
        
        prepayCards.filter(p=>p.gift).forEach(v=>{
            balance += (v.price+v.gift)
            pay += v.price
        })

        const arrBalances = prepayCards.filter(p=>p.serviceItemId).map(p=>{ 
            pay += p.price
            return {
                memberId,
                serviceItemId:p.serviceItemId,
                balance:p.count
            }
        })

        const balancesOld = await balances.find({memberId:m._id}).toArray()

        const session = mongoClient.startSession()
        let result
        await session.withTransaction(async()=>{

            //更新余额
            result = await members.findOneAndUpdate({_id:m._id},{$inc:{balance:balance}},{session})
            
            //插入次卡余额
            for (const b of arrBalances) {
                if(balancesOld.some(bo=>
                    bo.serviceItemId.toString() == b.serviceItemId.toString()))
                {
                    balances.updateOne({memberId:m._id,serviceItemId:b.serviceItemId},
                        {$inc:{balance:b.balance}})
                }
                else
                {
                    balances.insertOne(b,{session})
                }
            }
    
            
            //插入充值记录
            await chargeItem.insertOne({
                memberId:m._id,
                employees,
                balance:result.value.balance,
                pay:pay,
                amount,
                itemId:item,
                time:new Date()
            },{session})
        })

        await session.endSession()
        await mongoClient.close()
        return true
    },
    add:async (member,item,employees)=>{
        item = item?ObjectId.createFromHexString(item._id):item
        employees = employees.map(it=>ObjectId.createFromHexString(it._id))
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        const chargeItem = db.collection('ChargeItem')
        const balances = db.collection('Balance')
        const cards = await db.collection('PrepaidCard')

        const maxNo = await members.findOne({},{
        sort:{
            no:-1
        },
        projection:{
            no:1
        }})
        
        if(maxNo)
            member.no = maxNo.no+1
        else
            member.no = 80000
        
        const prepayCards = await cards.find({ _id:item }).toArray()
        let pay = member.balance
        const amount = member.balance
        prepayCards.filter(p=>p.gift).forEach(v=>{
            member.balance += (v.price+v.gift)
            pay += v.price
        })

        //插入会员
        const result = await members.insertOne(member)
        const memberId = result.insertedId

        const arrBalances = prepayCards.filter(p=>p.serviceItemId).map(p=>{ 
            pay += p.price
            return {
                memberId,
                serviceItemId:p.serviceItemId,
                balance:p.count
            }
        })
        
        //插入余额
        if(arrBalances&&arrBalances.length)
            await balances.insertMany(arrBalances)

        //插入充值记录
        await chargeItem.insertOne({
            memberId:memberId,
            employees,
            balance:member.balance,
            pay:pay,
            amount,
            itemId:item,
            time:new Date()
        })

        await mongoClient.close()
        return memberId
        
    }
})