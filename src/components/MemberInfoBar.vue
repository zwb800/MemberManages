<template>
<template v-if="member">
  <div class="row q-gutter-md q-mt-none justify-between text-no-wrap ">
      <q-field class=" q-mt-none" label="姓名" stack-label borderless>
          <template v-slot:control>
              {{member.member.name}}
          </template>
      </q-field>
      <q-field class=" q-mt-none" label="手机号" stack-label borderless>
          <template v-slot:control>
              {{member.member.phone}}
          </template>
      </q-field>
      <q-field class=" q-mt-none" label="开卡时间" stack-label borderless>
          <template v-slot:control>
              <div class="">{{dateStr(member.member.newCardTime)}}</div>
          </template>
      </q-field>
      <q-field class="col-2 q-mt-none" label="余额" stack-label borderless>
          <template v-slot:control>
              ￥{{member.member.balance}}
          </template>
      </q-field>
      <q-field class="col-2 q-mt-none" label="累计消费" stack-label borderless>
          <template v-slot:control>
              ￥{{member.member.consume}}
          </template>
      </q-field>
  </div>
  <div  class="row q-gutter-md q-mt-none">
      
      <template v-if="member">
      <template :key="b.serviceItemName" v-for="b in member.balances">
      <q-field class="col q-mt-none" :label='b.serviceItemName' stack-label borderless>
          <template v-slot:control>
              {{b.balance}}
          </template>
      </q-field>
      </template>
      </template>
  </div>
</template>
</template>
<script lang='ts'>
import { defineComponent,onMounted,ref} from 'vue'
import { dateStr } from './utils'
export default defineComponent({
   props:{member:{type:Object, required:false}},
    setup(){
        return {
             dateStr
        }
    },
   
})
</script>

<style>

</style>