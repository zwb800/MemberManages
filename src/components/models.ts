
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

export interface MemberAPI{
  get:(id:string)=>Promise<Member>,
  all:(keyword:string)=>Promise<Array<Member>>,
  add:(member:Member,chargeItems:PrepaidCard[],employees:Employee[])=>Promise<Uint8Array>,
  consume:(memberId:string,serviceItems:Array<{_id:string,count:number}>)=>Promise<Uint8Array>
}

export interface PrepaidCard{
  _id:string;
  price:number;
  gift:number;
  head:number;
  ice:number;
  ginger:number;
  hair:number;
  label:string;
}

export interface CardAPI{
  all:()=>Promise<Array<PrepaidCard>>
}

export interface ServiceItem{
  _id:string,
  name:string,
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
  }
 
}

export interface ChargeItem{
  _id:Uint8Array;

}

export interface Employee{
  _id:string;
  name:string;
}

export interface EmployeeAPI{
  all:()=>Promise<Array<Employee>>;
}