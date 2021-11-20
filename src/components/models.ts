
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

export interface PrepaidCard{
  _id:Uint8Array;
  price:number;
  gift:number;
}

export interface CardAPI{
  all:()=>Promise<Array<PrepaidCard>>
}

declare global {
  interface Window{
    memberAPI:MemberAPI;
    cardAPI:CardAPI;
  }
 
}

export interface ChargeItem{
  _id:Uint8Array;

}