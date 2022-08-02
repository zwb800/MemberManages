<template>
<template v-if="member">
  <div class="row q-gutter-lg q-mt-none text-no-wrap ">
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
              <div :title='dateTimeStr(member.member.newCardTime)'>{{dateStr(member.member.newCardTime)}}</div>
          </template>
      </q-field>
      <q-field class="q-mt-none" style="min-width:100px" label="储值卡余额" stack-label borderless>
          <template v-slot:control>
              ￥{{member.member.balance}}
          </template>
      </q-field>
      <q-field class="q-mt-none" style="min-width:50px" label="累计消费" stack-label borderless>
          <template v-slot:control>
              ￥{{member.member.consume}}
          </template>
      </q-field>
      <template v-if="member">
      <template :key="b.serviceItemName" v-for="b in member.balances">
      <q-field class="q-mt-none" style="min-width:50px" :label='b.serviceItemName' stack-label borderless>
          <template v-slot:control>
              {{(b.serviceItemName.includes('折')?'￥':'')+b.balance}}
          </template>
      </q-field>
      </template>
      </template>
  </div>
</template>
</template>
<script lang='ts'>
import { defineComponent} from 'vue'
import { dateStr, dateTimeStr } from './utils'
export default defineComponent({
   props:{member:{type:Object, required:false}},
    setup(){
        return {
             dateStr,dateTimeStr
        }
    },
   
})
</script>

<style>

</style>