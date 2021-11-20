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
              v-model="cardtype2" :options="cardoptions2"></q-btn-toggle>
            </div>
          </div>
          <p class="q-mb-none">套盒</p>
          <q-btn-toggle clearable
           toggle-color="primary"
           v-model="cardtype3" :options="cardoptions3"></q-btn-toggle>
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
import { PrepaidCard } from './models'
export default defineComponent({
    components:{
        EmployeeOptions,
    },
    props:['card','card2','card3','pay'],
    emits:['update:card','update:card2','update:card3','update:pay'],

    setup(props,context){
      const cardtype1 = ref<PrepaidCard>(props.card)
      const cardtype2 = ref<PrepaidCard>(props.card2)
      const cardtype3 = ref<PrepaidCard>(props.card3)
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

          cardoptions2.value = cards.filter((it)=>it.head).map((c)=>{
            return {
              value : c,
              label:c.label}
          })

          cardoptions3.value = cards.filter((it)=>it.ice||it.hair||it.ginger).map((c)=>{
            return {
              value : c,
              label:c.label}
          })
 
      })
      
      return {
        cardoptions,
        cardoptions2,
        cardoptions3,
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