<template>
<q-dialog ref="dialog" @before-show="show" persistent>
    <q-card class="full-width">
         <q-card-section class="row q-pb-none">
          <div class="text-h6">会员详情</div>
          <q-space />
          <q-btn round flat icon="close" v-close-popup></q-btn>
        </q-card-section>
        <q-card-section class="q-pb-none q-pt-none">
            <q-splitter v-model="splitterModel" unit="px">
                <template v-slot:before>
                    <q-tabs v-model="tab" vertical >
                        <q-tab icon="info" name="info" label="详情"></q-tab>
                        <q-tab icon="credit_card" name="charge" label="充值"></q-tab>
                        <q-tab icon="paid" name="consume" label="划卡"></q-tab>
                    </q-tabs>
                </template>
                <template v-slot:after>
                    <q-tab-panels v-model="tab" class="q-pl-sm" style="min-height:320px">
                        <q-tab-panel name="info">
                            <member-info-bar :memberId="memberId"></member-info-bar>
                        </q-tab-panel>
                        <q-tab-panel name="charge" class="q-pa-none">
                            <q-table 
                                rows-per-page-label="每页条数"
                                no-results-label="无数据"
                                no-data-label="无数据"
                                loading-label="加载中" :rows="chargeRows" :columns="chargeColumns" flat></q-table>
                        </q-tab-panel>
                        <q-tab-panel
                            name="consume" class="q-pa-none">
                            <q-table
                                rows-per-page-label="每页条数"
                                no-results-label="无数据"
                                no-data-label="无数据"
                                loading-label="加载中" 
                                :rows="consumeRows" 
                                :columns="consumeColumns" flat></q-table>
                        </q-tab-panel>
                    </q-tab-panels>
                </template>
            </q-splitter>
  </q-card-section>
        <!-- <q-separator></q-separator> 
         <q-card-actions align="right">
            
            <q-btn label="划卡" color="primary"></q-btn>
              <q-btn label="充值" color="secondary" ></q-btn>
        </q-card-actions> -->
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import MemberInfoBar from './MemberInfoBar.vue'
import { defineComponent,ref } from 'vue'
import { ConsumeView,ChargeView } from './models'
import { dateTimeStr } from './utils'
export default defineComponent({
    components:{
        MemberInfoBar
    },
   props:{'memberId':{type:String,required:true}},
    setup(props){

        const consumeRows = ref<Array<ConsumeView>>()
        const chargeRows = ref<Array<ChargeView>>()
        const tab = ref('info')
        return {
            splitterModel:ref(80),
            show:async ()=>{
                
                tab.value = 'info'
                consumeRows.value = await window.consumeAPI.getConsumeList(props.memberId)
                
                chargeRows.value = await window.memberAPI.getChargeList(props.memberId)
            },
            tab,
            consumeRows,
            consumeColumns:[
                { label:'时间',field:'time',
                format:dateTimeStr},
                { label:'项目',field:'product',
                format:(p:Array<{name:string,count:number}>)=>{
                    let result = ''
                    p.forEach((pv)=>{ result += `${pv.name}x${pv.count} `})
                    return result
                }},
                { label:'金额',field:'price'},
            ],
            chargeRows,
            chargeColumns:[
                { label:'时间',field:'time',
                format:dateTimeStr},
                { label:'项目',field:'card',format:(v:string,row:ChargeView)=>{
                    return (row.card?row.card:'') + (row.amount?` 单充${row.amount}元`:'')
                }
                
                },
                {label:'支付',field:'pay'}
            ]
        }
    }
})
</script>

<style>

</style>