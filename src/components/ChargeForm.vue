<template>
<div class="q-gutter-md">
  <div class="row">
            <div class="col">
              <p class="q-mb-sm">储值卡</p>
              <q-btn-toggle clearable
              toggle-color="primary"
              v-model="cardtype1" :options="cardoptions"></q-btn-toggle>
            </div>
            <div class="col-4 q-ml-md">
              <p class="q-mb-sm">次卡</p>
              <q-btn-toggle clearable
              toggle-color="primary"
              v-model="cardtype2" :options="[
                {label:'1288次卡',value:1288},
                {label:'2088次卡',value:2088},
              ]"></q-btn-toggle>
            </div>
          </div>
          <p class="q-mb-none">套盒</p>
          <q-btn-toggle clearable
           toggle-color="primary"
           v-model="cardtype3" :options="[
            {label:'姜疗套盒',value:6},
            {label:'冰疗套盒',value:7},
            {label:'发疗套盒',value:8},
            {label:'头皮套盒',value:9},
          ]"></q-btn-toggle>
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
import { defineComponent,ref,watch,onMounted } from 'vue'
export default defineComponent({
    components:{
        EmployeeOptions,
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


      const cardoptions = ref<{lable:string,value:number}[]>([{label:'',value:0}])
      onMounted(async ()=>{
        const cards = await window.cardAPI.all()
        // cardoptions.value = cards.map((c)=>{return {value : 1,label:`充${c.price}送${c.gift}`}})
      })

   
      
      return {
        cardoptions,
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