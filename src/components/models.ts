import {  ObjectId } from 'bson';

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}


export interface Member {
  // _id:ObjectId;
  no: number;
  name: string;
  balance:number;
  newCardTime:Date;
}

export interface MemberAPI{
  all:(keyword:string)=>Promise<Array<Member>>,
  add:(member:Member)=>Promise<ObjectId>
}

declare global {
  interface Window{
    memberAPI:MemberAPI
  }
}