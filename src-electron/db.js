import { MongoClient } from 'mongodb'
import { contextBridge } from 'electron'



export const connect = async()=>{
    const mongoClient = new MongoClient('mongodb://localhost:27017')
    await mongoClient.connect()
    return mongoClient
}

export const get = async(name)=>{
    const mongoClient = await connect()
    const db = mongoClient.db('MemberManages')
    const serviceItems = await db.collection(name)
    const cursor = serviceItems.find()
    const arr = await cursor.toArray()
    await mongoClient.close()
    arr.forEach(v=>v._id = v._id.toString())
    return arr
}

export const exposeAll = (apiname,name,api={})=>{
    
    contextBridge.exposeInMainWorld(apiname,Object.assign({
        all:async()=>{
            return get(name)
        }
    },api))
}
