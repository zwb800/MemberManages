<template>
  <q-page padding>
    <div class="row q-gutter-sm">
      <q-btn icon="refresh" title="刷新" @click="getRows" rounded></q-btn>
      <q-btn
        icon="add"
        title="新增预约"
        @click="showR = true"
        color="primary"
        rounded
      ></q-btn>
    </div>
    <q-table
      row-key="id"
      class="q-mt-sm"
      flat
      bordered
      :rows-per-page-options="[0]"
      :rows="rows"
      :columns="columns"
    >
      <template v-slot:body-cell-id="props">
        <q-td :props="props">
          <q-btn
            flat
            color="primary"
            @click="cancel(props.value)"
            label="取消"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="showR">
      <q-card style="min-width: 200px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">预约</div>
        </q-card-section>
        <q-form @submit="newR()" autofocus greedy>
          <q-card-section>
            <q-select
              label="预约时间"
              v-model="time"
              :options="timeOptions"
              stack-label
            ></q-select>
            <q-field label="人数" stack-label borderless>
              <template v-slot:control>
                <q-btn-toggle
                  class="q-mt-md"
                  :options="[
                    { label: '1', value: 1 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4', value: 4 },
                  ]"
                  v-model="num"
                ></q-btn-toggle>
              </template>
            </q-field>
            <q-input v-model="remark" label="备注"></q-input>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-actions align="right">
            <q-btn icon="close" v-close-popup round flat></q-btn>
            <q-btn
              type="submit"
              :loading="loading"
              icon="done"
              color="teal"
              round
              flat
            ></q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang='ts' setup>
import { api, Member } from '../components/models';

import { ref, onMounted } from 'vue';
import { dateStr, timeStr } from '../components/utils';
import { QDialog, useQuasar } from 'quasar';

const $q = useQuasar();
const rows = ref();
const showR = ref(false);
const num = ref(1);
const time = ref('');
const timeOptions = ref(Array<string>());
const remark = ref('');

const getRows = async () => {
  rows.value = await api.reservation.all();

  setTimeout(() => {
    getRows().then(null, null);
  }, 15 * 60 * 1000);
};

onMounted(async () => {
  await getRows();
  const result = await api.reservation.available();
  const now = new Date();
  for (const r of result) {
    if (new Date(dateStr(now) + ' ' + r.time) >= now)
      timeOptions.value.push(r.time);
  }
  time.value = timeOptions.value[0];
});

const columns = ref([
  { label: '预定时间', name: 'time', field: 'time', format: timeStr },
  {
    label: '会员',
    name: 'member',
    field: 'member',
    format: (m: Member) => (m == null ? '' : m.name),
  },
  {
    label: '手机号',
    name: 'phone',
    field: 'member',
    format: (m: Member) => (m == null ? '' : m.phone),
  },
  { label: '备注', name: 'remark', field: 'remark' },
  { label: '人数', name: 'num', field: 'num' },
  {
    label: '下单时间',
    name: 'create_time',
    field: 'create_time',
    format: timeStr,
  },
  { name: 'id', label: '操作', field: 'id' },
]);

const cancel = (id: number) => {
  $q.dialog({
    title: '确认',
    message: '确认撤销吗？',
    cancel: true,
  }).onOk(() => {
    $q.loading.show();
    api.reservation
      .cancel(id)
      .then(async (result) => {
        if (result) {
          await getRows();
          $q.notify('操作成功');
        } else {
          $q.notify({
            message: '操作失败',
            type: 'negative',
            position: 'center',
            timeout: 2000,
          });
        }
      })
      .finally(() => {
        $q.loading.hide();
      });
  });
};

const newR = () => {
  $q.loading.show();
  api.reservation
    .add(
      new Date(dateStr(new Date()) + ' ' + time.value),
      num.value,
      remark.value
    )
    .then(async (result) => {
      if (result) {
        await getRows();
        $q.notify('操作成功');
        showR.value = false;
        num.value = 1
        remark.value = ''
      } else {
        $q.notify({
          message: '操作失败',
          type: 'negative',
          position: 'center',
          timeout: 2000,
        });
      }
    })
    .finally(() => {
      $q.loading.hide();
    });
};
</script>

<style>
</style>