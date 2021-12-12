<template>
<q-dialog ref="dialog" @before-show="show" persistent>
    <q-card class="full-width">
        <q-bar class="bg-info text-white">
          <div>会员详情</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="q-pb-none q-pt-none">
  <q-tabs v-model="tab"  
    class="text-grey"
    active-color="primary"
    indicator-color="primary">
    <q-tab name="info" label="详情"></q-tab>
      <q-tab name="charge" label="充值"></q-tab>
      <q-tab name="consume" label="划卡"></q-tab>
  </q-tabs>
  <q-tab-panels v-model="tab" style="min-height:320px">
      <q-tab-panel name="info">
        <member-info-bar :member="member"></member-info-bar>
      </q-tab-panel>
      <q-tab-panel name="charge">
          <q-table flat></q-table>
      </q-tab-panel>
      <q-tab-panel name="consume" class="q-pa-none">
          <q-table :rows="consumeRows" :columns="consumeColumns" flat></q-table>
      </q-tab-panel>
  </q-tab-panels>
  </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            
            <q-btn label="划卡" color="primary"></q-btn>
              <q-btn label="充值" color="secondary" ></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import MemberInfoBar from './MemberInfoBar.vue'
import { defineComponent,ref } from 'vue'
import { ConsumeView } from './models'
export default defineComponent({
    components:{
        MemberInfoBar
    },
   props:{'member':{type:Object,required:true}},
    setup(props){

        const consumeRows = ref<Array<ConsumeView>>()
        const tab = ref('info')
        return {
            show:async ()=>{
                tab.value = 'info'
                consumeRows.value = await window.consumeAPI.getConsumeList(props.member._id)
            },
            tab,
            consumeRows,
            consumeColumns:[
                { label:'时间',field:'time',
                format:(d:Date)=>`${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`},
                { label:'项目',field:'product',format:(p:Array<{name:string,count:number}>)=>{
                    let result = ''
                    p.forEach((pv)=>{ result += `${pv.name}x${pv.count} `})
                    return result
                }},
                { label:'金额',field:'price'},
            ]
        }
    }
})
</script>

<style>

</style>