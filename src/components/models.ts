export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}


export interface Member {
  id: string;
  name: string;
}

export interface MemberAPI{
  all:()=>Promise<Array<Member>>
}

declare global {
  interface Window{
    memberAPI:MemberAPI
  }
}