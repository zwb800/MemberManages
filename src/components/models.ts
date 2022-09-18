import axios from 'axios';
import { MemberAPI } from './memberApi';
import { ConsumeAPI } from './consumeApi';
import { cache } from './utils';
import { ReservationAPI } from './reservationApi';

if (window.hasOwnProperty('env'))
  axios.defaults.baseURL = eval(`window.env.API_URL`) as string;
// axios.defaults.baseURL = 'https://service-908mprqb-1305763203.sh.apigw.tencentcs.com/release/'
else
  axios.defaults.baseURL =
    location.protocol + '//' + location.hostname + ':9000';
  // axios.defaults.baseURL = 'http://winpad:9000'

let shopId = localStorage.getItem('shopId');
if (shopId == null) {
  shopId = '1';
}

axios.defaults.headers.common['shopId'] = shopId;

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Member {
  _id: string;
  no: number;
  name: string;
  balance: number;
  consume: number;
  newCardTime: Date;
  phone: string;
}

export interface ConsumeView {
  time: Date;
  product: Array<{ name: string; count: number }>;
  price: number;
}

export interface MemberView {
  member: Member;
  balances: Array<{ serviceItemName: string; balance: number }>;
}

export interface ChargeView {
  time: Date;
  card: string;
  product: Array<{ name: string; count: number }>;
  balance: number;
  pay: number;
  amount: number;
  serviceItems: Array<{ name: string; count: number }>;
  employees: Array<string>;
}

export interface PrepaidCard {
  id: number;
  price: number;
  gift: number;
  label: string;
  discount: number;
}

export class CardAPI {
  async all(): Promise<Array<PrepaidCard>> {
    return cache<Array<PrepaidCard>>('/prepaidcard');
  }
}

export interface ServiceItem {
  id: number;
  name: string;
  shortName: string;
  price: number;
}

export class ServiceItemAPI {
  async all(): Promise<Array<ServiceItem>> {
    return cache<Array<ServiceItem>>('/serviceitem');
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

export interface ChargeItem {
  id: Uint8Array;
}

export interface Employee {
  id: number;
  name: string;
  shopId: string;
  deleted: boolean;
}

export interface WorkView {
  employee: string;
  consumers: Array<{ _id: string; name: string; items: Array<string> }>;
  charges: Array<{
    id: string;
    name: string;
    card: PrepaidCard;
    commission: number;
  }>;
}
export interface StatisticsView {
  consumes: Array<{
    time: string;
    employees: Array<{ employeeId: number; items: Array<{serviceItemId:number}> }>;
  }>;
  charges: Array<{
    time: string;
    pay: number;
    employees: Array<number>;
    shopId: string;
  }>;
}

export interface FooterView {
  sum: number;
  new: number;
  items: Array<{ label: string; count: number }>;
  cardCount: number;
  sale: number;
  cardPrice: number;
  otherPrice: number;
  cards: Array<number>;
}

export class EmployeeAPI {
  async footer(startDate: Date, endDate: Date) {
    const result = await axios.get('/employee/footer', {
      params: { startDate, endDate },
    });
    return result.data as FooterView;
  }
  async all(includeDeleted = false): Promise<Array<Employee>> {
    const result = await cache<Array<Employee>>('/employee');
    if (includeDeleted) return result;
    else return result.filter((e) => e.deleted == null || e.deleted == false);
  }
  async work(
    startDate: Date,
    endDate: Date
  ): Promise<{ rows: Array<WorkView>; footer: FooterView }> {
    const result = await axios.get('/employee/work', {
      params: { startDate, endDate },
    });
    return result.data as { rows: Array<WorkView>; footer: FooterView };
  }

  async statictics(year: number, month: number): Promise<StatisticsView> {
    const result = await axios.get('/employee/statistics', {
      params: { year, month },
    });
    return result.data as StatisticsView;
  }
}

export interface Stock {
  id: string;
  name: string;
  count: number;
  unit: string;
}

export interface StockLog {
  time: Date;
  count: number;
  stockId: string;
}

export class StockAPI {
  async getLogs(id: string): Promise<StockLog[]> {
    const result = await axios.get('/stock/logs', { params: { id } });
    const r = result.data as StockLog[];
    r.forEach((e) => (e.time = new Date(e.time)));
    return r;
  }

  async update(id: string, num: number) {
    const result = await axios.post('/stock', { id, num });
    return result.data;
  }

  async getAll(): Promise<Stock[]> {
    const result = await axios.get('/stock', {});
    return result.data as Promise<Stock[]>;
  }

  async add(name: string, unit: string) {
    const result = await axios.post(`/stock/add`, { name, unit });
    return result.data;
  }
}

export const api = {
  memberAPI: new MemberAPI(),
  consumeAPI: new ConsumeAPI(),
  serviceItemAPI: new ServiceItemAPI(),
  employeeAPI: new EmployeeAPI(),
  reservation: new ReservationAPI(),
  cardAPI: new CardAPI(),
  stockAPI: new StockAPI(),
};
