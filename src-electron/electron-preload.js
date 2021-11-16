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
import { contextBridge } from 'electron'
import { MongoClient } from 'mongodb'
contextBridge.exposeInMainWorld('backend', {
    connect:async ()=>{
        const mongoClient = new MongoClient('mongodb://localhost:27017')
        await mongoClient.connect()
        const db = mongoClient.db('MemberManages')
        const members = db.collection('Member')
        const cursor = members.find()
        cursor.forEach(it=>{
            
        }).then(v=>{

        })
        
    }
})
    