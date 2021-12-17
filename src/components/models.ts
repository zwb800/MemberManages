
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

export interface MemberAPI{
  get:(id:string)=>Promise<MemberView>,
  all:(keyword:string)=>Promise<Array<Member>>,
  add:(member:Member,chargeItem:PrepaidCard|undefined,employees:Employee[])=>Promise<Uint8Array>,
  charge:(memberId:string,amount:number,chargeItem:PrepaidCard|undefined,employees:Employee[])=>Promise<Uint8Array>,
  getChargeList:(memberId:string)=>Promise<Array<ChargeView>>
}

export interface ConsumeAPI{
  consume:(
    memberId:string,
    serviceItems:Array<{serviceItemId:string,count:number}>,
    employees:Array<{employeeId:string,items:Array<string>}>)=>Promise<Uint8Array>,
  getConsumeList:(memberId:string)=>Promise<Array<ConsumeView>>
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

export interface ServiceItemAPI{
  all:()=>Promise<Array<ServiceItem>>
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

export interface EmployeeAPI{
  all:()=>Promise<Array<Employee>>;
  work:(startDate:Date,endDate:Date)=>Promise<Array<WorkView>>;
}