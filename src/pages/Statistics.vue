<template>
  <q-input stack-label v-model="dateRef" label="月份" type="date"></q-input>
  <q-markup-table dense separator="cell">
    <thead>
      <tr>
        <th></th>
        <th :colspan="serviceItems.length" v-for="e in employees" :key="e">
          {{ e.name }}
        </th>
      </tr>
      <tr>
        <th></th>
        <template v-for="e in employees" :key="e">
          <th v-for="s in serviceItems" :key="s">{{ s.shortName }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in rowsRef" :key="r">
        <td
          v-for="(c, i) in r"
          :key="c"
          :class="{ b: i % serviceItems.length == 0 }"
        >
          <template v-if="c != 0">
            {{ c }}
          </template>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  <q-markup-table dense separator="cell" class="sumtable">
    <thead>
      <tr>
        <th></th>
        <th v-for="(s, i) in serviceItems" :key="s">
          {{ s.shortName }}({{ priceServiceItems[i] }})
        </th>
        <th>工作量提成</th>
        <th>办卡提成</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="r in sumRowsRef" :key="r">
        <td v-for="c in r" :key="c">
          <template v-if="c != 0">
            {{ c }}
          </template>
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  <q-markup-table dense separator="cell" class="sumtable">
    <thead>
      <th>卡数</th>
      <th>总办卡金额</th>
    </thead>
    <tbody>
      <tr>
        <td>{{ cardCount }}</td>
        <td>{{ sumCharge }}</td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script lang="ts" setup>
import { dateStr } from '../components/utils';
import { onMounted, ref, watch } from 'vue';
import { api, Employee, ServiceItem } from '../components/models';

const employees = ref(Array<Employee>());
const serviceItems = ref(Array<ServiceItem>());
const rowsRef = ref(Array<Array<number | string>>());
const sumRowsRef = ref(Array<Array<number | string>>());
// const priceServiceItems = ref([5, 2, 2, 2, 2, 3, 5, 3, 2, 5]);
const priceServiceItems = ref([5,5,5,5,5,5,5,5,5,5])
const dateRef = ref(dateStr(new Date()));
const sumCharge = ref(0);
const cardCount = ref(0);

const mapServiceItems = new Map<number, number>();
const mapEmployees = new Map<number, number>();

const initMap = () => {
  let index = 0;
  for (const it of serviceItems.value) {
    mapServiceItems.set(it.id, index++);
  }
  let eIndex = 0;
  for (const e of employees.value) {
    mapEmployees.set(e.id, eIndex++);
  }
};

const item2Index = (employeeId: number, item: number) => {
  let eI = mapEmployees.get(employeeId);
  let sI = mapServiceItems.get(item);
  if (!eI) eI = 0;
  if (!sI) sI = 0;
  return eI * serviceItems.value.length + sI + 1;
};

const initRow = (size: number) => {
  const rows = Array<Array<number | string>>(size + 1);
  for (let i = 0; i < rows.length; i++) {
    const column = Array<number | string>(
      employees.value.length * serviceItems.value.length + 1
    );
    column.fill(0);
    if (i == rows.length - 1) {
      column[0] = '总';
    } else {
      column[0] = i + 1;
    }

    rows[i] = column;
  }
  return rows;
};

const loadData = async () => {
  const date = new Date(dateRef.value);
  const result = await api.employeeAPI.statictics(
    date.getFullYear(),
    date.getMonth() + 1
  );
  employees.value = await api.employeeAPI.all(false);
  serviceItems.value = (await api.serviceItemAPI.all()).filter(
    (v) => v.shortName != '面护体验' && v.shortName != 'CC'
  );
  initMap();

  const lastConsume = result.consumes[result.consumes.length - 1];

  const rows = initRow(new Date(lastConsume.time).getDate());
  for (const c of result.consumes) {
    const rowIndex = new Date(c.time).getDate() - 1;
    const columns = rows[rowIndex];
    for (const ce of c.employees) {
      for (const item of ce.items) {
        const cIndex = item2Index(ce.employeeId, item.serviceItemId);
        let v = columns[cIndex];
        if (typeof v == 'number') {
          v++;
          columns[cIndex] = v;
        }
      }
    }
  }

  //计算总工作量
  for (let i = 1; i < rows[0].length; i++) {
    let sum = 0;
    for (let j = 0; j < rows.length - 1; j++) {
      let v = rows[j][i];
      if (typeof v == 'number') {
        sum += v;
      }
    }
    rows[rows.length - 1][i] = sum;
  }

  const sumRow = rows[rows.length - 1];
  const sumRows = Array<Array<number | string>>();

  for (let i = 0; i < employees.value.length; i++) {
    const row = Array<number | string>();
    row.push(employees.value[i].name);
    let sumPrice = 0;
    for (let j = 0; j < serviceItems.value.length; j++) {
      const v = sumRow[i * serviceItems.value.length + j + 1];
      row.push(v);
      if (typeof v == 'number') sumPrice += v * priceServiceItems.value[j];
    }
    row.push(sumPrice);
    row.push(0);
    sumRows.push(row);
  }

  const profitColumn = new Array<number>(employees.value.length);
  profitColumn.fill(0);
  const lastColumnIndex = sumRows[0].length - 1;
  sumCharge.value = 0;
  for (const c of result.charges) {
    let es = new Array<number>();
    if (c.employees.length > 0) {
      es = c.employees;
    } else {
      //店内平分
      es = employees.value.filter((e) => e.shopId == c.shopId).map((p) => p.id);
    }
    const profit = c.pay / es.length / 10;

    for (const e of es) {
      const pIndex = mapEmployees.get(e);
      if (pIndex != undefined) {
        let v = sumRows[pIndex][lastColumnIndex];
        if (typeof v == 'number') {
          v += profit;
          sumRows[pIndex][lastColumnIndex] = v;
        }
      }
    }

    sumCharge.value += c.pay;
  }
  cardCount.value = result.charges.length;

  for (const c of sumRows) {
    const v = c[lastColumnIndex];
    if (typeof v == 'number') c[lastColumnIndex] = Math.round(v * 10) / 10;
  }

  sumRowsRef.value = sumRows;
  rowsRef.value = rows;
};

onMounted(loadData);
watch(dateRef, loadData);
</script>

<style>
thead tr th {
  position: sticky;
}

.sumtable .q-table {
  width: auto;
  text-align: center;
}

.q-table .b {
  border-right: solid black;
}
</style>