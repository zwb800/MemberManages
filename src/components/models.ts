
import axios from 'axios'
import { MemberAPI } from './memberApi'
import {ConsumeAPI} from './consumeApi'
import { cache } from './utils'

if(window.hasOwnProperty("env"))
  axios.defaults.baseURL = eval(`window.env.API_URL`) as string
else
  axios.defaults.baseURL = location.protocol+'//'+location.hostname+':9000'


let shopId = localStorage.getItem('shopId')
if(shopId == null)
{
  shopId = '1'
}

axios.defaults.headers.common['shopId'] = shopId

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}


export interface Member {
  _id:string;
  no: number;
  name: string;
  balance:number;
  consume:number;
  newCardTime:Date;
  phone:string;
}

export interface ConsumeView{
  time:Date;
  product:Array<{name:string,count:number}>;
  price:number;
}

export interface MemberView{
  member: Member
  balances: Array<{ serviceItemName: string; balance: number} >
}

export interface ChargeView{
  time:Date;
  card:string;
  balance:number;
  pay:number;
  amount:number;
  product:Array<{name:string,count:number}>;
}

export interface PrepaidCard{
  _id:string;
  price:number;
  gift:number;
  label:string;
}

export class CardAPI{
  async all():Promise<Array<PrepaidCard>> {
      return cache<Array<PrepaidCard>>('/prepaidcard')
  }
}

export interface ServiceItem{
  _id:string,
  name:string,
  shortName:string,
  price:number
}

export class ServiceItemAPI{
  async all():Promise<Array<ServiceItem>>{
      return cache<Array<ServiceItem>>('/serviceitem')
  }
}

// declare global {
//   interface Window{
//     memberAPI:MemberAPI;
//     cardAPI:CardAPI;
//     employeeAPI:EmployeeAPI;
//     serviceItemAPI:ServiceItemAPI;
//     consumeAPI:ConsumeAPI;
//   }
 
// }

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

export interface FooterView{
  sum:number;
  new:number;
  items:Array<{label:string,count:number}>;
  cardCount:number;
  sale:number;
  cardPrice:number;
  otherPrice:number;
  cards:Array<number>;
}

export class EmployeeAPI{
  async footer(startDate: Date, endDate: Date) {
    const result =  await axios.get(
      '/employee/footer',
      { params:{startDate,endDate} })
      return result.data as FooterView
  }
  async all():Promise<Array<Employee>>{
      return cache<Array<Employee>>('/employee')
  }
  async work(startDate:Date,endDate:Date):Promise<{rows:Array<WorkView>,footer:FooterView}>{
    const result =  await axios.get(
      '/employee/work',
      { params:{startDate,endDate} })
      return result.data as {rows:Array<WorkView>,footer:FooterView}
  }
  
}

export interface Stock{
  _id:string;
  name:string;
  count:number;
  unit:string;
}

export interface StockLog{
  time:Date;
  count:number;
  stockId:string;
}

export class StockAPI{
  async getLogs(_id: string): Promise<StockLog[]> {
    const result =  await axios.get(
      `/stock/logs`,
      { params:{id:_id }})
      const r = result.data as StockLog[]
      r.forEach(e=> e.time = new Date(e.time))
      return r
  }

  async update(id:string,num:number){
    const result =  await axios.post(
      `/stock`,
      {id,num })
      return result.data
  }

  async getAll():Promise<Stock[]>{
    const result =  await axios.get(
      `/stock`,
      {  })
      return result.data
  }

  async add(name:string,unit:string){
    const result =  await axios.post(
      `/stock/add`,
      {  name,unit })
      return result.data
  }
}


export const api =  {
  memberAPI:new MemberAPI(),
  consumeAPI:new ConsumeAPI(),
  serviceItemAPI:new ServiceItemAPI(),
  employeeAPI:new EmployeeAPI(),
  cardAPI:new CardAPI(),
  stockAPI:new StockAPI()
}