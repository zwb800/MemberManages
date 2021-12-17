export const padStr = (n:number)=>n.toString().padStart(2,'0')

export const dateStr = (date:Date)=>{
    
    return `${date.getFullYear()}-${padStr(date.getMonth()+1)}-${padStr(date.getDate())}`
}

export const dateTimeStr = (d:Date)=>{
    return `${dateStr(d)} ${padStr(d.getHours())}:${padStr(d.getMinutes())}`
}