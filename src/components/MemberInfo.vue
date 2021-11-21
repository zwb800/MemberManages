<template>
<q-dialog ref="dialog" @show="show" persistent>
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
          <q-table :rows="consumeData.rows" :columns="consumeData.columns" flat></q-table>
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
import { defineComponent,toRaw } from 'vue'
import { Member } from './models'
export default defineComponent({
    components:{
        MemberInfoBar
    },
    props:['member'],
   

    setup(props){

        return {
            show:()=>{
                console.log(props.member)
            },
            tab:'info',
            consumeData:{
                rows:[
                    { time:'2021-8-19 19:12',product:'头疗 + 眼疗',price:'78'},
                    { time:'2021-8-19 19:12',product:'头疗 + 眼疗',price:'78'},
                    { time:'2021-8-19 19:12',product:'头疗 + 眼疗',price:'78'},
                    { time:'2021-8-19 19:12',product:'头疗 + 眼疗',price:'78'},
                    { time:'2021-8-19 19:12',product:'头疗 + 眼疗',price:'78'},
                    { time:'2021-8-19 19:12',product:'头疗 + 眼疗',price:'78'},
                ],
                columns:[
                { label:'时间',field:'time',style:'width:100px'},
                { label:'项目',field:'product'},
                { label:'金额',field:'price'},

            ]
            }
        }
    }
})
</script>

<style>

</style>