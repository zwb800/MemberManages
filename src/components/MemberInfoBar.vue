<template>
  <div class="row q-gutter-md q-mt-none">
      <q-field class="col q-mt-none" label="姓名" stack-label borderless>
          <template v-slot:control>
              {{member.name}}
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="手机号" stack-label borderless>
          <template v-slot:control>
              {{member.phone}}
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="开卡时间" stack-label borderless>
          <template v-slot:control>
              {{dateStr(member.newCardTime)}}
          </template>
      </q-field>
  </div>
  <div class="row q-gutter-md q-mt-none">
      <q-field class="col q-mt-none" label="余额" stack-label borderless>
          <template v-slot:control>
              ￥{{member.balance}}
          </template>
      </q-field>
      <template v-if="m">
      <template :key="b.serviceItemName" v-for="b in m.balances">
      <q-field class="col q-mt-none" :label='b.serviceItemName' stack-label borderless>
          <template v-slot:control>
              {{b.balance}}
          </template>
      </q-field>
      </template>
      </template>
  </div>
</template>
<script lang='ts'>
import { defineComponent,onMounted,ref} from 'vue'
import { MemberView } from './models'
export default defineComponent({
   props:{'member':{type:Object,required:true}},
    setup(props){
        const m = ref<MemberView>()
        onMounted(async ()=>{
            m.value = await window.memberAPI.get(props.member._id)
            console.log(m.value)
        })
        
        return {
            m,
             dateStr (d:Date)
            {
                return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
            },
        }
    },
   
})
</script>

<style>

</style>