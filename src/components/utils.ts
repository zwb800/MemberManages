import axios from "axios"

export const padStr = (n:number)=>n.toString().padStart(2,'0')

export const dateStr = (date:Date)=>{
    
    return `${date.getFullYear()}-${padStr(date.getMonth()+1)}-${padStr(date.getDate())}`
}

export const dateTimeStr = (d:Date)=>{
    return `${dateStr(d)} ${padStr(d.getHours())}:${padStr(d.getMinutes())}`
}

export const cache = async function<T>(url:string):Promise<T>{
    const cacheResult = sessionStorage.getItem(url)
    if(cacheResult)
    {
        return JSON.parse(cacheResult)
    }
    else
    {
        const result = await axios.get(url)

        const r =  result.data as T
        sessionStorage.setItem(url,JSON.stringify(r))
        return r
    }
}