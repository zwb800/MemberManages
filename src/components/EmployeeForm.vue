<template>
  <p class="q-mb-none">头疗师</p>
 <q-field class="q-mt-none q-pb-none" borderless>
    <template v-slot:control>
      <btn-toggle
        @contextmenu="$event.preventDefault()"
        class="q-mt-none"
        :options="employee"
      ></btn-toggle>
    </template>
  </q-field> 

  <div class="row q-gutter-sm q-mt-none">
    <template :key="e.label" v-for="e in employee.filter((e) => e.selected)">
      <div>
        <p class="q-mb-sm">{{ e.label }}</p>
        <div>
          <btn-toggle
            @contextmenu="$event.preventDefault()"
            :options="e.items"
          ></btn-toggle>
        </div>
      </div>
    </template>
  </div> 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BtnToggle from './BtnToggle.vue';
export default defineComponent({
  components: { BtnToggle },
  props: ['employee'],
});
</script>

<style>
</style>