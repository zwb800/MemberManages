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

const mongoClient = new MongoClient('mongodb://localhost:27017')

contextBridge.exposeInMainWorld('memberAPI', {
    all:async (keyword)=>{
        await mongoClient.connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        
        const cursor = members.find({$or:[{name:{$regex:keyword}},{phone:{$regex:keyword}}]},{
            sort:{no:-1}
        })
        return new Promise(resolve=>{
            cursor.toArray().then((v)=>{
                resolve(v)
            }).finally(()=>{
                mongoClient.close()
            })
        })
        
    },
    add:async (member,items)=>{
        await mongoClient.connect()
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
        
        const result = await members.insertOne(member)
        const chargeItem = db.collection('ChargeItem')
        
        const insertedId = result.insertedId
        
        for (const it of items) {
            const cR = await chargeItem.insertOne({
                memberId:insertedId,itemId:ObjectId.createFromHexString('000000000000000000000000')})
            console.log(cR)
        }
        

        mongoClient.close()
        return insertedId
        
    }
})
    