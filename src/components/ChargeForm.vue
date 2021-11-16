<template>
<div class="q-gutter-md">
  <div class="row">
            <div class="col">
              <p class="q-mb-sm">储值卡</p>
              <q-btn-toggle
              toggle-color="primary"
              v-model="cardtype" :options="[
                {label:'充300送100',value:300},
                {label:'充500送200',value:500},
                {label:'充1000送500',value:1000},
              ]"></q-btn-toggle>
            </div>
            <div class="col-4 q-ml-md">
              <p class="q-mb-sm">次卡</p>
              <q-btn-toggle
              toggle-color="primary"
              v-model="cardtype3" :options="[
                {label:'1288次卡',value:1288},
                {label:'2088次卡',value:2088},
              ]"></q-btn-toggle>
            </div>
          </div>
          <p class="q-mb-none">套盒</p>
          <q-btn-toggle
           toggle-color="primary"
           v-model="cardtype2" :options="[
            {label:'姜疗套盒',value:6},
            {label:'冰疗套盒',value:7},
            {label:'发疗套盒',value:8},
            {label:'头皮套盒',value:9},
          ]"></q-btn-toggle>
        <p class="q-mb-none">支付方式</p>
          <q-btn-toggle
           toggle-color="secondary"
           v-model="paytype" :options="[
            {label:'微信',value:300},
            {label:'支付宝',value:500},
            {label:'农信',value:800},
            {label:'现金',value:1000}
          ]"></q-btn-toggle>
          
           <employee-options></employee-options>
</div>
</template>

<script>
import EmployeeOptions from './EmployeeOptions.vue'
export default {
    components:{
        EmployeeOptions
    },

    data(){
        return {
             cardtype:0,
            cardtype2:0,
            cardtype3:0,
            paytype:0,
        }
    }

}
</script>

<style>

</style>