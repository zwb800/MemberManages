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
    add:async (member,items,employees)=>{
        items = items.map(it=>ObjectId.createFromHexString(it._id))
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
        
        const prepayCards = await cards.find({ _id:{$in:items} }).toArray()
        
        member.balance = 0
        prepayCards.filter(p=>p.gift).forEach(v=>{
            member.balance += (v.price+v.gift)
        })

        //插入会员
        const result = await members.insertOne(member)
        const memberId = result.insertedId

        const arrBalances = prepayCards.filter(p=>p.serviceItemId).map(p=>{ 
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
            itemId:items,
            time:new Date()
        })

        await mongoClient.close()
        return memberId
        
    }
})