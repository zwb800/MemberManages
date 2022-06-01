import axios from 'axios'
import {
    Member
} from './models'

export interface Reservation{
  time:Date,
  member:Member,
  num:number
}

export interface Response{
  updated:number
}


  
export class ReservationAPI{

  async cancel(id:string):Promise<boolean>{
    const result = await axios.post(
      '/reservation/cancelById',
      {id} )

      const r = result.data as Response

      return r.updated > 0
  }
  async all():Promise<Array<Reservation>>{
    const result =  await axios.get(
      '/reservation/list',
      { params:{} })
      const r =  result.data as Array<Reservation>
      r.forEach(e=> e.time = new Date(e.time))
      
      return r
  }

}