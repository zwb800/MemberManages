<template>
<div class="q-gutter-md">
  <div class="row">
            <div class="col">
              <p class="q-mb-sm">储值卡</p>
              <btn-toggle
              toggle-color="primary"
              v-model="cardtype1" :options="[
                {label:'充300送100',value:300},
                {label:'充500送200',value:500},
                {label:'充1000送500',value:1000},
              ]"></btn-toggle>
            </div>
            <div class="col-4 q-ml-md">
              <p class="q-mb-sm">次卡</p>
              <btn-toggle
              toggle-color="primary"
              v-model="cardtype2" :options="[
                {label:'1288次卡',value:1288},
                {label:'2088次卡',value:2088},
              ]"></btn-toggle>
            </div>
          </div>
          <p class="q-mb-none">套盒</p>
          <btn-toggle
           toggle-color="primary"
           v-model="cardtype3" :options="[
            {label:'姜疗套盒',value:6},
            {label:'冰疗套盒',value:7},
            {label:'发疗套盒',value:8},
            {label:'头皮套盒',value:9},
          ]"></btn-toggle>
        <p class="q-mb-none">支付方式</p>
          <q-btn-toggle
           v-model="paytype" :options="[
            {label:'微信',value:300},
            {label:'支付宝',value:500},
            {label:'农信',value:800},
            {label:'现金',value:1000}
          ]"></q-btn-toggle>
          
           <employee-options></employee-options>
</div>
</template>

<script lang='ts'>
import EmployeeOptions from './EmployeeOptions.vue'
import BtnToggle from './BtnToggle.vue'
import { defineComponent,ref,watch } from 'vue'
export default defineComponent({
    components:{
        EmployeeOptions,
        BtnToggle
    },
    props:['card','card2','card3','pay'],
    emits:['update:card','update:card2','update:card3','update:pay'],
    setup(props,context){
      const cardtype1 = ref<number>(props.card)
      const cardtype2 = ref<number>(props.card2)
      const cardtype3 = ref<number>(props.card3)
      const paytype = ref<number>(props.pay)

      watch(cardtype1,()=>{
        context.emit('update:card',cardtype1.value)
      })

      watch(cardtype2,()=>{
        context.emit('update:card2',cardtype2.value)
      })

      watch(cardtype3,()=>{
        context.emit('update:card3',cardtype3.value)
      })

      watch(paytype,()=>{
        context.emit('update:pay',paytype.value)
      })
      
      return {
        cardtype1,
        cardtype2,
        cardtype3,
        paytype
      }
    },
})
</script>

<style>

</style>