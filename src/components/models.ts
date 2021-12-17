import axios from 'axios'
export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}


export interface Member {
  _id:string|null;
  no: number;
  name: string;
  balance:number;
  newCardTime:Date;
}

export interface ConsumeView{
  time:Date;
  product:Array<{name:string,count:number}>;
  price:number;
}

export interface MemberView{
  member:Member;
  balances:Array<{serviceItemName:string,balance:number}>;
}

export interface ChargeView{
  time:Date;
  card:string;
  balance:number;
  pay:number;
  amount:number;
}

axios.defaults.baseURL = 'http://localhost:3000'

export class MemberAPI{
  async get(id:string):Promise<MemberView>{
    const result = await axios.get(
      '/member/get',
      { params:{id:id} })

      const r =  result.data as MemberView
      r.member.newCardTime = new Date(r.member.newCardTime)
      return r
  }
  async all(keyword:string):Promise<Array<Member>>{
    const result =  await axios.get(
      '/member/',
      { params:{search:keyword} })
      const r =  result.data as Array<Member>
      r.forEach(e=> e.newCardTime = new Date(e.newCardTime))
      
      return r
  }
  async add(member:Member,chargeItem:PrepaidCard|undefined,employees:Employee[]):Promise<Uint8Array>{
    const result =  await axios.get(
      '/member/',
      { params:{} })
      return result.data as Uint8Array
  }
  async charge(memberId:string,amount:number,chargeItem:PrepaidCard|undefined,employees:Employee[]):Promise<Uint8Array>{
    const result =  await axios.get(
      '/member/',
      { params:{} })
      return result.data as Uint8Array
  }
  async getChargeList(memberId:string):Promise<Array<ChargeView>>{
    const result =  await axios.get(
      '/member/charge-list/',
      { params:{memberId} })

      const r = result.data as Array<ChargeView>
      r.forEach(e=> e.time = new Date(e.time))
      return r
  }
}

export class ConsumeAPI{
  async consume(
    memberId:string,
    serviceItems:Array<{serviceItemId:string,count:number}>,
    employees:Array<{employeeId:string,items:Array<string>}>):Promise<Uint8Array>{
      const result =  await axios.get(
        '/member/',
        { params:{} })
        return result.data as Uint8Array
    }
    async getConsumeList(memberId:string):Promise<Array<ConsumeView>>{
      const result =  await axios.get(
        '/member/',
        { params:{} })
        return result.data as Array<ConsumeView>
    }
}

export interface PrepaidCard{
  _id:string;
  price:number;
  gift:number;
  label:string;
}

export interface CardAPI{
  all:()=>Promise<Array<PrepaidCard>>
}

export interface ServiceItem{
  _id:string,
  name:string,
  shortName:string,
  price:number
}

export class ServiceItemAPI{
  async all():Promise<Array<ServiceItem>>{
    const result =  await axios.get(
      '/member/',
      { params:{} })
      return result.data as Array<ServiceItem>
  }
}

declare global {
  interface Window{
    memberAPI:MemberAPI;
    cardAPI:CardAPI;
    employeeAPI:EmployeeAPI;
    serviceItemAPI:ServiceItemAPI;
    consumeAPI:ConsumeAPI;
  }
 
}

export interface ChargeItem{
  _id:Uint8Array;

}

export interface Employee{
  _id:string;
  name:string;
}

export interface WorkView{
  employee:string;
  consumers:Array<{_id:string,name:string,items:Array<string>}>
  charges:Array<{_id:string,name:string,card:PrepaidCard,commission:number}>
}

export class EmployeeAPI{
  async all():Promise<Array<Employee>>{
    const result =  await axios.get(
      '/member/',
      { params:{} })
      return result.data as Array<Employee>
  }
  async work(startDate:Date,endDate:Date):Promise<Array<WorkView>>{
    const result =  await axios.get(
      '/member/',
      { params:{} })
      return result.data as Array<WorkView>
  }
}

Object.assign(window,{
  memberAPI:new MemberAPI(),
  consumeAPI:new ConsumeAPI(),
  serviceItemAPI:new ServiceItemAPI(),
  employeeAPI:new EmployeeAPI()
})