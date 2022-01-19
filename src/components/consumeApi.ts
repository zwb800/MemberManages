
import axios from 'axios'
import {ConsumeView} from './models'
export class ConsumeAPI{
  async refund(id: string) {
    const result =  await axios.post(
      '/consume/refund',
      { id })
    
    return result.data as boolean
  }
  async consume(
    memberId:string,
    serviceItems:Array<{serviceItemId:string,count:number}>,
    employees:Array<{employeeId:string,items:Array<string>}>):Promise<boolean>{
      const result =  await axios.post(
        '/consume',
        { 
          
          memberId,
          serviceItems,
          employees
        
      })
        return result.data as boolean
    }
    async getConsumeList(memberId:string):Promise<Array<ConsumeView>>{
      const result =  await axios.get(
        '/consume',
        { params:{memberId} })
      const r = result.data as Array<ConsumeView>
      r.forEach(e=> e.time = new Date(e.time))
      
      return r
    }
    async getAllConsumeList(startDate:Date,endDate:Date){
      const result =  await axios.get(
        '/consume/getAllConsumeList',
        { params:{startDate,endDate} })
      const r = result.data as Array<ConsumeView>
      r.forEach(e=> e.time = new Date(e.time))
      
      return r
    }
}