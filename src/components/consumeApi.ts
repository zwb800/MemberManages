import axios from 'axios';
import { ConsumeView } from './models';
export class ConsumeAPI {
  async refund(id: string) {
    const result = await axios.post('/consume/refund', { id });

    return result.data as string;
  }
  async consume(
    memberId: number,
    serviceItems: Array<{ serviceItemId: number; count: number }>,
    employees: Array<{ employeeId: number; items: Array<number> }>
  ): Promise<string> {
    const result = await axios.post('/consume', {
      memberId,
      serviceItems,
      employees,
    });
    return result.data as string;
  }
  async getConsumeList(
    memberId: string,
    start: number,
    count: number
  ): Promise<Array<ConsumeView>> {
    const result = await axios.get('/consume', {
      params: { memberId, start, count },
    });
    const r = result.data as Array<ConsumeView>;
    r.forEach((e) => (e.time = new Date(e.time)));

    return r;
  }

  async work(
    consumeId: number,
    employees: Array<{ employeeId: number; items: Array<number> }>
  ): Promise<string> {
    const result = await axios.post('/consume/work', {
      consumeId,
      employees,
    });
    return result.data as string;
  }

  async getConsumeListCount(memberId: string): Promise<number> {
    const result = await axios.get('/consume/list_count', {
      params: { memberId },
    });
    const r = parseInt(result.data);

    return r;
  }
  async getAllConsumeList(startDate: Date, endDate: Date) {
    const result = await axios.get('/consume/getAllConsumeList', {
      params: { startDate, endDate },
    });
    const r = result.data as Array<ConsumeView>;
    r.forEach((e) => (e.time = new Date(e.time)));

    return r;
  }
}
