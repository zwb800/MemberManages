<template>
<div class="q-gutter-sm">
  
  <div class="row">
    <div class="col-2 q-mr-md">
      <q-input standout="bg-teal text-white" 
      label="单付金额" mask="####" 
      v-model="amountValue"></q-input>
    </div>
          
          </div>
          <div class="row">
              <div class="col">
              <p class="q-mb-sm">储值卡</p>
              <q-btn-toggle clearable
              toggle-color="primary"
              v-model="cardtype" :options="cardoptions"></q-btn-toggle>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <p class="q-mb-sm">次卡</p>
              <q-btn-toggle clearable
              toggle-color="primary"
              v-model="cardtype" :options="cardoptions2"></q-btn-toggle>
            </div>
            <div class="col">
          <p class="q-mb-sm">套盒</p>
          <q-btn-toggle clearable
           toggle-color="primary"
           v-model="cardtype" :options="cardoptions3"></q-btn-toggle>
            </div>
          </div>
        <p class="q-mb-none">支付方式</p>
          <q-btn-toggle
           v-model="paytype" :options="[
            {label:'微信',value:300},
            {label:'支付宝',value:500},
            {label:'农信',value:800},
            {label:'现金',value:1000}
          ]"></q-btn-toggle>
          
           <employee-options v-model="employeesC"></employee-options>
</div>
</template>

<script lang='ts'>
import EmployeeOptions from './EmployeeOptions.vue'
import { defineComponent,ref,watch,onMounted } from 'vue'
import { Employee, PrepaidCard } from './models'
export default defineComponent({
    components:{
        EmployeeOptions,
    },
    props:['amount','card','pay','employees'],
    emits:['update:amount','update:card','update:pay','update:employees'],

    setup(props,context){
      const cardtype = ref<PrepaidCard|undefined>(props.card)
      const paytype = ref<number>(props.pay)
      const amountValue = ref<number|string|undefined>(props.amount)
      watch(amountValue,()=>{
        if(amountValue.value!=undefined && amountValue.value!='')
          cardtype.value = undefined
        
        context.emit('update:amount',amountValue.value)
      })

      watch(cardtype,()=>{
        if(cardtype.value!= undefined)
          amountValue.value = undefined
        
        context.emit('update:card',cardtype.value)
      })

      watch(paytype,()=>{
        context.emit('update:pay',paytype.value)
      })

      

      var cardoptions = ref<{label:string,value:PrepaidCard}[]>([])
      var cardoptions2 = ref<{label:string,value:PrepaidCard}[]>([])
      var cardoptions3 = ref<{label:string,value:PrepaidCard}[]>([])
      onMounted(async ()=>{
        const cards = await window.cardAPI.all()
        cardoptions.value = cards.filter((it)=>it.gift).map((c)=>{
            return {
              value : c,
              label:c.label}
          })

          cardoptions2.value = cards.filter((it)=>it.label.includes('次卡')).map((c)=>{
            return {
              value : c,
              label:c.label
              }
          })

          cardoptions3.value = cards.filter((it)=>it.label.includes('套盒')).map((c)=>{
            return {
              value : c,
              label:c.label}
          })
 
      })

      const employeesC = ref(Array<Employee>())

      watch(employeesC,()=>{
        context.emit('update:employees',employeesC.value)
      })
      
      return {
        amountValue,
        cardoptions,
        cardoptions2,
        cardoptions3,
        cardtype,
        paytype,
        employeesC
      }
    },
})
</script>

<style>

</style>