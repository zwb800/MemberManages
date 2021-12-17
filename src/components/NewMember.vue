<template>
<q-dialog ref="dialog" persistent>
    <q-card style="min-width:600px">
        <q-card-section class="row q-pb-none">
          <div class="text-h6">开卡</div>
          <q-space />
          <q-btn round flat icon="close" v-close-popup></q-btn>
        </q-card-section>
        <q-form @submit="add" greedy autofocus>
        <q-card-section class="q-pt-none">
      
          <div class="row ">
            <q-input class="col" label="姓名" v-model="member.name"
             :rules="[ val => val && val.length > 0 || '请填写姓名'] "></q-input>
            <q-input class="col q-ml-md" label="手机号" v-model="member.phone"
            :rules="[ val => val && val.length >0 || '请输入手机号'] "></q-input>
          </div>
      
      <charge-form 
      v-model:amount="amount"
      v-model:card="card" 
      v-model:pay="paytype"
      v-model:employees="employees"></charge-form>
      </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right" class="">
          <span>{{text?'应付金额:':''}}</span><span class="text-negative text-bold">{{text}}</span>&nbsp;
            <q-btn label="开卡" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
        </q-form>
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import ChargeForm from './ChargeForm.vue'
import {defineComponent,ref,toRaw,watch } from 'vue'
import { QDialog,useQuasar } from 'quasar'
import {Member, PrepaidCard,Employee} from './models'

export default defineComponent({
    components:{ ChargeForm},
    emits:[
      'finished',
    ],
   
    setup(props, context){
      const $q = useQuasar()
      const card = ref<PrepaidCard>()
      const paytype = ref(0)
      const amount = ref<number|undefined>()
      const employees = ref(Array<Employee>())
      const member = ref<Member>({
        _id:null,
        name:'',
        no:0,
        balance:0,
        newCardTime:new Date()
      })

      const text = ref('')
      watch([amount,card],()=>{
        text.value = ''
        if(amount.value && amount.value>0)
          text.value += `+${amount.value}`
        if(card.value)
          text.value += `+${card.value?.price}`

        text.value = text.value.substring(1)

        if(text.value.includes('+'))
        {
          const sum = parseInt(eval(text.value))
          text.value += `=${sum}`
        }
      })
      
      const add =  async()=>{

        if(amount.value)
          member.value.balance = parseInt(amount.value.toString())
        
        const result = await window.memberAPI.add(
          toRaw(member.value),
          toRaw(card.value),
          toRaw(employees.value))
      

        if(result)
          {

              $q.notify({
                  message:'开卡成功',
                  type:'positive',
                  position:'center',
                  timeout:1000
              })

              member.value = {
                _id:null,
                name:'',
                no:0,
                balance:0,
                newCardTime:new Date()
              }

              amount.value = undefined
              paytype.value = 0
              text.value = ''
              card.value = undefined
              dialog.value?.hide()
              context.emit.call(null,'finished')
            }
            else
            {
                dialog.value?.shake()
                $q.notify({
                    message:'开卡失败',
                    type:'negative',
                    position:'center',
                    timeout:2000
                })
            }
      }
      const dialog = ref<QDialog>()

      return {
        amount,
        employees,
        text,
        dialog,
        member,
        add,
        card,
        paytype
      }
    }
})
</script>

<style>

</style>