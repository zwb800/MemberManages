<template>
  <q-dialog ref="dialog" @before-show="show" persistent>
    <q-card style="min-width: 800px">
      <q-card-section class="row q-pb-none">
        <div class="text-h6">工作量</div>
        <q-space />
        <q-btn round flat icon="close" v-close-popup></q-btn>
      </q-card-section>
      <q-form ref="form" @submit="submit" greedy>
        <q-card-section class="q-pt-none">
          <div>
            <employee-form :employee="employee"></employee-form>
          </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            label="保存"
            :loading="submitting"
            type="submit"
            color="primary"
          ></q-btn>
          <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useQuasar, QDialog, QForm } from 'quasar';
import EmployeeForm from './EmployeeForm.vue';
import { api } from './models';

interface EmployeeOption {
  value: { id: number };
  label: string;
  selected: boolean;
  items: Array<{ value: number; label: string; selected: boolean }>;
}

interface ServiceItemOption {
  label: string;
  count: number;
  value: { serviceItemId: number; shortName: string };
}

export default defineComponent({
  components: { EmployeeForm },
  props: { consumeId: { type: Number, required: true } },
  emits: ['finished'],
  setup(props, context) {
    const employee = ref<Array<EmployeeOption>>([]);
    let initEmployee = Array<EmployeeOption>();

    let initRow = new Array<ServiceItemOption>();

    const init = () => {
      employee.value = JSON.parse(
        JSON.stringify(initEmployee)
      ) as Array<EmployeeOption>;
    };

    onMounted(async () => {
      initRow = (await api.serviceItemAPI.all()).map((e) => {
        return {
          label: e.name,
          count: e.name == '头疗' ? 1 : 0,
          value: { serviceItemId: e.id, shortName: e.shortName },
        };
      });

      const eItems = initRow.map((e) => {
        return {
          value: e.value.serviceItemId,
          label: e.value.shortName,
          selected: e.value.shortName == '头',
        };
      });

      initEmployee = (await api.employeeAPI.all()).map((e) => {
        return {
          value: e,
          label: e.name,
          selected: false,
          items: JSON.parse(JSON.stringify(eItems)) as Array<{
            value: number;
            label: string;
            selected: boolean;
          }>,
        };
      });

      init();
    });

    const dialog = ref<QDialog>();
    const form = ref<QForm>();
    const $q = useQuasar();

    const submitting = ref(false);
    return {
      form,
      employee,
      show: () => {
        init();
      },
      submit: async () => {
        if (!submitting.value) {
          submitting.value = true;
          let es = employee.value
            ?.filter((p) => p.selected)
            .map((p) => {
              return {
                employeeId: p.value.id,
                items: p.items
                  .filter((pp) => pp.selected)
                  .map((pp) => pp.value),
              };
            });

          if (!es) es = [];

          const result = await api.consumeAPI.work(props.consumeId, es);

          submitting.value = false;
          if (result == '') {
            dialog.value?.hide();
            context.emit.call(null, 'finished');

            $q.notify({
              message: '修改成功',
              type: 'positive',
              position: 'center',
              timeout: 1000,
            });
          } else {
            dialog.value?.shake();
            $q.notify({
              message: result,
              type: 'negative',
              position: 'center',
              timeout: 2000,
            });
          }
        }
      },
      submitting,
      dialog,
    };
  },
});
</script>

<style>
</style>