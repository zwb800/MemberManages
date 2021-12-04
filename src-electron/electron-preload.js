/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import { debug } from 'console'
import { contextBridge } from 'electron'
import { MongoClient } from 'mongodb'
import { ObjectId } from 'bson'


const connect = async()=>{
    const mongoClient = new MongoClient('mongodb://localhost:27017')
    await mongoClient.connect()
    return mongoClient
}

contextBridge.exposeInMainWorld('serviceItemAPI',{
    all:async()=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const serviceItems = await db.collection('ServiceItem')
        const cursor = serviceItems.find()
        const arr = await cursor.toArray()
        await mongoClient.close()
        arr.forEach(v=>v._id = v._id.toString())
        return arr
}

})

contextBridge.exposeInMainWorld('employeeAPI',{
    all:async()=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const employees = await db.collection('Employee')
        const cursor = employees.find()
        const arr = await cursor.toArray()
        await mongoClient.close()
        arr.forEach(v=>v._id = v._id.toString())
        return arr
}

})

contextBridge.exposeInMainWorld('cardAPI',{
    all:async ()=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const cards = await db.collection('PrepaidCard')
        const cursor = cards.find()
        const arr = await cursor.toArray()
        await mongoClient.close()
        arr.forEach(v=>v._id = v._id.toString())
        return arr
    }
})

contextBridge.exposeInMainWorld('memberAPI', {
    consume:async(id,serviceItems)=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        const m = await members.findOne({_id:ObjectId.createFromHexString(id)}) 
        const consumes = db.collection('Consumes')
        const result = await consumes.insertOne({
            memberId:ObjectId.createFromHexString(id),
            serviceItems:serviceItems.map((e)=>{
                return {_id:e._id,count:e.count}
            })
        })
        const insertedId = result.insertedId
        return insertedId
    },
    get:async(id)=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        return await members.findOne({_id:ObjectId.createFromHexString(id)}) 
    },
    all:async (keyword)=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        
        const cursor = members.find({$or:[{name:{$regex:keyword}},{phone:{$regex:keyword}}]},{
            sort:{no:-1}
        })
        const arr = await (await cursor.toArray())
        arr.forEach(v=>v._id = v._id.toString())
        await mongoClient.close()
        return arr
        
    },
    add:async (member,items,employees)=>{
        items = items.map(it=>{return ObjectId.createFromHexString(it._id)})
        employees = employees.map(it=>{return ObjectId.createFromHexString(it._id)})
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')

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
        member.head = 0
        member.balance = 0
        member.hair = 0
        member.ice = 0
        member.ginger = 0
        member.facemask = 0
        member.eye = 0

        const cards = await db.collection('PrepaidCard')
        const cursorCards = await cards.find(
            { 
                _id:{$in:items}
        })
        const cs = await cursorCards.toArray()
        
        cs.forEach(c=>{
            if(c.gift){
                member.balance += (c.price+c.gift)
            }
            else if(c.head)
            {
                member.head += c.head
            }
            else if(c.eye)
            {
                member.eye += c.eye
            }
            else if(c.facemask)
            {
                member.facemask += c.facemask
            }
            else if(c.ice)
            {
                member.ice += c.ice
            }
            else if(c.ginger)
            {
                member.ginger += c.ginger
            }
            else if(c.hair)
            {
                member.hair += c.hair
            }
        })
           
        const result = await members.insertOne(member)
        const chargeItem = db.collection('ChargeItem')
        
        const insertedId = result.insertedId
        const cR = await chargeItem.insertOne({
            memberId:insertedId,
            employees,
            itemId:items})
        console.log(cR)
        

        await mongoClient.close()
        return insertedId
        
    }
})
    