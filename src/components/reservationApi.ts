import axios from 'axios';
import { Member } from './models';

export interface Reservation {
  time: Date;
  create_time: Date;
  member: Member;
  num: number;
}

export interface AvailableReservation {
  time: string;
  num: number;
}

export interface Response {
  updated: number;
}

export interface AddResponse {
  id: string;
}

export class ReservationAPI {
  async cancel(id: number): Promise<boolean> {
    const result = await axios.post<boolean>('/reservation/cancelById', {
      id,
    });

    return result.data;
  }

  async add(time: Date, num: number, remark: string): Promise<boolean> {
    let shopId = localStorage.getItem('shopId');
    if (shopId == null) {
      shopId = '1';
    }

    const result = await axios.post('/reservation/add', {
      time,
      num,
      shopId,
      remark,
    });

    const r = result.data as AddResponse;
    return r.id != null;
  }

  async all(): Promise<Array<Reservation>> {
    const result = await axios.get('/reservation/list', { params: {} });
    const r = result.data as Array<Reservation>;
    r.forEach((e) => {
      e.time = new Date(e.time);
      e.create_time = new Date(e.create_time);
    });

    return r;
  }

  async available(): Promise<Array<AvailableReservation>> {
    const result = await axios.get('/reservation', { params: {} });
    const r = result.data as Array<AvailableReservation>;

    return r;
  }
}
