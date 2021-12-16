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


import { connect,exposeAll } from './db'
import './member'
import './consume'



exposeAll('employeeAPI','Employee',{
    work:async(startDate,endDate)=>{
        const mongoClient = await connect()
        const db = mongoClient.db('MemberManages')
        const employees = await db.collection('Employee').find().toArray()
        const consumes = db.collection('Consumes')
        const members = db.collection('Member')
        const serviceItems = await db.collection('ServiceItem').find().project({_id:1,shortName:1}).toArray()
        
        const result = Array()
        for(const e of employees){
            const cArr = await consumes.find(
                {
                    'employees.employeeId':e._id,
                    $and:[{time:{$gte:startDate}},{time:{$lte:endDate}}]
                }).toArray()
            
            const consumers = Array()
            for (const c of cArr) {
                const m = await members.findOne({_id:c.memberId},{projection:{name:1}})
                const items = Array()
                const itemIds = c.employees.find(v=>v.employeeId.equals(e._id)).items
                
                for (const i of itemIds) {
                    const s = await serviceItems.find(v=>v._id.equals(i))
                    items.push(s.shortName)
                }
                
                consumers.push({name:m.name,items:items})
            }
           
            result.push({
                employee:e.name,
                consumers:consumers
            })
        }

        await mongoClient.close()
        return result
    }
})

exposeAll('cardAPI','PrepaidCard')
exposeAll('serviceItemAPI','ServiceItem')
    