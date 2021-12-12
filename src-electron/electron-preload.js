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

import { get } from './db'
import './member'
import './consume'


const exposeAll = (apiname,name)=>{
    contextBridge.exposeInMainWorld(apiname,{
        all:async()=>{
            return get(name)
        }
    })
}

exposeAll('employeeAPI','Employee')
exposeAll('cardAPI','PrepaidCard')
exposeAll('serviceItemAPI','ServiceItem')
    