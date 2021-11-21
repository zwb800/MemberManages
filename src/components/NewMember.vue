<template>
<q-dialog ref="dialog" persistent>
    <q-card style="min-width:600px">
        <q-bar class="bg-secondary text-white">
          <div>开卡</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-form class="q-gutter-md q-pb-md" @submit="add" greedy autofocus>
        <q-card-section class="">
      
          <div class="row q-mt-none">
            <q-input class="col" label="姓名" v-model="member.name"
             :rules="[ val => val && val.length > 0 || '请填写姓名'] "></q-input>
            <q-input class="col q-ml-md" label="手机号" v-model="member.phone"
            :rules="[ val => val && val.length >0 || '请输入手机号'] "></q-input>
          </div>
      
      <charge-form 
      v-model:card="card" 
      v-model:card2="card2" 
      v-model:card3="card3" 
      v-model:pay="paytype"
      v-model:employees="employees"></charge-form>
      </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <span>{{text?'应付金额:':''}}</span><span class="text-negative text-bold">{{text}}</span>&nbsp;
            <q-btn label="提交" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
        </q-form>
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import ChargeForm from './ChargeForm.vue'
import {defineComponent,ref,toRaw,watch } from 'vue'
import { QDialog } from 'quasar'
import {Member, PrepaidCard,Employee} from './models'

export default defineComponent({
    components:{ ChargeForm},
    emits:[
      'added',
    ],
   
    setup(props, context){
      const card = ref<PrepaidCard>()
      const card2 = ref<PrepaidCard>()
      const card3 = ref<PrepaidCard>()
      const paytype = ref(0)
      const employees = ref(Array<Employee>())
      const member = ref<Member>({
        _id:'',
        name:'',
        no:0,
        balance:0,
        newCardTime:new Date()
      })

      const text = ref('')
      watch([card,card2,card3],()=>{
        text.value = ''
        if(card.value)
          text.value += `+${card.value?.price}`
        
        
        if(card2.value)
        text.value += `+${card2.value?.price}`
        if(card3.value)
          text.value += `+${card3.value?.price}`

        text.value = text.value.substring(1)

        if(text.value.includes('+'))
        {
          const sum = parseInt(eval(text.value))
          text.value += `=${sum}`
        }
       
      })

 
      
      const add =  async()=>{
        const chargeItems = new Array<PrepaidCard>()
        if(card.value)
          chargeItems.push(toRaw(card.value))
        if(card2.value)
          chargeItems.push(toRaw(card2.value))
        if(card3.value)
          chargeItems.push(toRaw(card3.value))

        
        const insertedId = await window.memberAPI.add(
          toRaw(member.value),
          chargeItems,
          toRaw(employees.value))
        member.value = {
          _id:'',
          name:'',
          no:0,
          balance:0,
          newCardTime:new Date()
        }

      paytype.value = 0
      text.value = ''
        dialog.value?.hide()
        context.emit.call(null,'added')
        console.log(insertedId)
      }
      const dialog = ref<QDialog>()

      return {
        employees,
        text,
        dialog,
        member,
        add,
        card,
        card2,
        card3,
        paytype
      }
    }
})
</script>

<style>

</style>