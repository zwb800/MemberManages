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
      <q-field class="col q-mt-none" label="头疗" stack-label borderless>
          <template v-slot:control>
              {{member.head}}
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="姜疗" stack-label borderless>
          <template v-slot:control>
              {{member.ginger}}
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="冰疗" stack-label borderless>
          <template v-slot:control>
              {{member.ice}}
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="发疗" stack-label borderless>
          <template v-slot:control>
              {{member.hair}}
          </template>
      </q-field>
  </div>
</template>
<script lang='ts'>
import { defineComponent} from 'vue'
export default defineComponent({
    props:['member'],
    setup(){
        return {
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