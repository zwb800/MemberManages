<template>
<q-dialog ref="dialog" persistent>
    <q-card style="min-width:600px">
        <q-bar class="bg-secondary text-white">
          <div>充值</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
<q-form @submit="submit">
        <q-card-section class="q-pt-none">
          <member-info-bar :member="member"></member-info-bar>
            <charge-form 
              v-model:amount="amount"
                v-model:card="card" 
                v-model:pay="paytype"
                v-model:employees="employees"></charge-form>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
                    <span>{{text?'应付金额:':''}}</span><span class="text-negative text-bold">{{text}}</span>&nbsp;
            <q-btn label="充值" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
</q-form>
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import ChargeForm from './ChargeForm.vue'
import MemberInfoBar from './MemberInfoBar.vue'
import {defineComponent,watch,ref,toRaw} from 'vue'
import { PrepaidCard,Employee} from './models'
import { QDialog,useQuasar } from 'quasar'


export default defineComponent({
    components:{ ChargeForm, MemberInfoBar},
   props:{'member':{type:Object}},
   emits:['finished'],
    setup(props,context){
      const $q = useQuasar()
        const card = ref<PrepaidCard>()
        const paytype = ref(0)
        const amount = ref<number|undefined>()
        const employees = ref(Array<Employee>())

        const dialog = ref<QDialog>()

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

        const submit =  async()=>{
          if(!props.member)
            return
           let amountV = 0
        if(amount.value)
          amountV = parseInt(amount.value.toString())
          
        const result = await window.memberAPI.charge(
          props.member._id,
          amountV,
          toRaw(card.value),
          toRaw(employees.value))
        
          if(result)
          {
              dialog.value?.hide()
              context.emit.call(null,'finished')

              $q.notify({
                  message:'充值成功',
                  type:'positive',
                  position:'center',
                  timeout:1000
              })

              text.value = ''
                amount.value = undefined
                paytype.value = 0
                card.value = undefined
                dialog.value?.hide()
                context.emit.call(null,'finished')
            }
            else
            {
                dialog.value?.shake()
                $q.notify({
                    message:'充值失败',
                    type:'negative',
                    position:'center',
                    timeout:2000
                })
            }
       
        
        }
      return {
        amount,
        text,
        employees,
        dialog,
        submit,
        card,
        paytype
      }
    }

})
</script>

<style>

</style>