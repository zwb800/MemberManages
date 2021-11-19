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
      
      <charge-form v-model:card="card" v-model:card2="card2" v-model:card3="card3" v-model:pay="paytype"></charge-form>
      </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          {{card}} {{card2}} {{card3}}
            <q-btn label="提交" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
        </q-form>
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import ChargeForm from './ChargeForm.vue'
import {defineComponent,ref,toRaw } from 'vue'
import { QDialog } from 'quasar'
import {Member} from './models'

export default defineComponent({
    components:{ ChargeForm},
    emits:[
      'added',
    ],
   
    setup(props, context){
      const card = ref(0)
      const card2 = ref(0)
      const card3 = ref(0)
      const paytype = ref(0)
      const member = ref<Member>({
        _id:null,
        name:'',
        no:0,
        balance:0,
        newCardTime:new Date()
      })
      
      
      const add =  async()=>{
        const chargeItems = new Array<Uint8Array>()
        if(card.value>0)
          chargeItems.push(new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0]))

        const insertedId = await window.memberAPI.add(toRaw(member.value),chargeItems)
        
        dialog.value?.hide()
        context.emit.call(null,'added')
        console.log(insertedId)
      }
      const dialog = ref<QDialog>()

      return {
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