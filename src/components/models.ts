
export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}


export interface Member {
  _id:Uint8Array|null;
  no: number;
  name: string;
  balance:number;
  newCardTime:Date;
}

export interface MemberAPI{
  all:(keyword:string)=>Promise<Array<Member>>,
  add:(member:Member,chargeItems:Uint8Array[])=>Promise<Uint8Array>
}

declare global {
  interface Window{
    memberAPI:MemberAPI
  }
 
}

export interface ChargeItem{
  _id:Uint8Array;

}