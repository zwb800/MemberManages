import { ObjectId } from 'bson'
import { contextBridge } from 'electron'

import {connect} from './db'

const getNo = async(db)=>{
    let no = 80000
    const members = db.collection('Member')
    const maxNo = await members.findOne({},{
        sort:{
            no:-1
        },
        projection:{
            no:1
        }})
        
        if(maxNo)
            no = maxNo.no+1
    return no
}

const charge = async(mongoClient,member,amount,card,employees)=>{
    const db = mongoClient.db('MemberManages')
    const members = db.collection('Member')
    const cards = db.collection('PrepaidCard')
    const balances = db.collection('Balance')
    const chargeItem = db.collection('ChargeItem')

    const prepayCard = await cards.findOne({ _id:card })
    let balance = amount
    let pay = amount
    let arrBalances = Array()

    if(prepayCard){
        pay += prepayCard.price
        if(prepayCard.gift){
            balance += (prepayCard.price+prepayCard.gift)
        }
        if(prepayCard.serviceItemIds){
             arrBalances = prepayCard.serviceItemIds.map(p=>{
                 return {
                    serviceItemId:p.serviceItemId,
                    balance:p.count
                }
            })
        }
    }
    
    const session = mongoClient.startSession()
    let accountBalance = 0
    await session.withTransaction(async()=>{
        let balancesOld = Array()
        
        if(member._id)
        {
            balancesOld = await balances.find({memberId:member._id}).toArray()
            //更新余额
            const result = await members.findOneAndUpdate({_id:member._id},
                {$inc:{balance:balance}},{session})
            accountBalance = result.value.balance
        }
        else
        {
            member.no = await getNo(db)
            member.balance = balance
            const r = await members.insertOne(member,{session})
            member._id = r.insertedId
            accountBalance = balance
            
        }
        
        //插入次卡余额
        for (const b of arrBalances) {
            if(balancesOld.some(bo=>bo.serviceItemId.equals(b.serviceItemId)))
            {
                await balances.updateOne({memberId:member._id,serviceItemId:b.serviceItemId},
                    {$inc:{balance:b.balance}})
            }
            else
            {
                await balances.insertOne(Object.assign(b,{memberId:member._id}),{session})
            }
        }

        
        //插入充值记录
        await chargeItem.insertOne({
            memberId:member._id,
            employees,
            balance:accountBalance,//充完余额
            pay:pay,//实际支付
            amount,//单付
            itemId:card,
            time:new Date()
        },{session})
    })

    await session.endSession()
    return true
}

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
    charge:async(memberId,amount,card,employees)=>{
        memberId = ObjectId.createFromHexString(memberId)
        card = card?ObjectId.createFromHexString(card._id):card
        employees = employees.map(it=>ObjectId.createFromHexString(it._id))

        const mongoClient = await connect()
        

        await charge(mongoClient,{_id:memberId},amount,card,employees)

        await mongoClient.close()
        return true
    },
    add:async (member,card,employees)=>{
        card = card?ObjectId.createFromHexString(card._id):card
        employees = employees.map(it=>ObjectId.createFromHexString(it._id))

        const mongoClient = await connect()
        
        await charge(mongoClient,member,member.balance,card,employees)
        
        await mongoClient.close()
        return true
        
    }
})