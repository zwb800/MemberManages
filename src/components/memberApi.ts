import axios from 'axios'
import {
    Member,
    MemberView,
    PrepaidCard,
    ChargeView,
    Employee
} from './models'


  
export class MemberAPI{

  async get(id:string):Promise<MemberView>{
    const result = await axios.get(
      '/member/get',
      { params:{id:id} })

      const r =  result.data as MemberView
      r.member.newCardTime = new Date(r.member.newCardTime)
      return r
  }
  async all(keyword:string,index:number,pageSize:number):Promise<Array<Member>>{
    const result =  await axios.get(
      '/member/',
      { params:{search:keyword,index,pageSize} })
      const r =  result.data as Array<Member>
      r.forEach(e=> e.newCardTime = new Date(e.newCardTime))
      
      return r
  }
  async add(member:Member,card:PrepaidCard|undefined,employees:Employee[]):Promise<Uint8Array>{
    const result =  await axios.post(
      '/member/',
      { member,card,employees })
      return result.data as Uint8Array
  }
  async charge(memberId:string,amount:number,card:PrepaidCard|undefined,employees:Employee[]):Promise<Uint8Array>{
    const result =  await axios.post(
      '/member/charge',
      { memberId,amount,card,employees })
      return result.data as Uint8Array
  }

  async getAllChargeList(startDate:Date,endDate:Date):Promise<Array<ChargeView>>{
    const result =  await axios.get(
      '/member/all-charge-list/',
      { params:{startDate,endDate} })

      const r = result.data as Array<ChargeView>
      r.forEach(e=> e.time = new Date(e.time))
      return r
  }

  async getChargeList(memberId:string):Promise<Array<ChargeView>>{
    const result =  await axios.get(
      '/member/charge-list/',
      { params:{memberId} })

      const r = result.data as Array<ChargeView>
      r.forEach(e=> e.time = new Date(e.time))
      return r
  }

  async refund(id: string) {
    const result =  await axios.post(
      '/member/refund',
      { id })
    
    return result.data as boolean
  }
}