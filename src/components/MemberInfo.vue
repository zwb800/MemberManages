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
                            <member-info-bar :member="member"></member-info-bar>
                        </q-tab-panel>
                        <q-tab-panel name="charge" class="q-pa-none">
                            <q-table 
                          
                                :rows="chargeRows" :columns="chargeColumns" flat></q-table>
                        </q-tab-panel>
                        <q-tab-panel
                            name="consume" class="q-pa-none">
                            <q-table
                          
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
import { defineComponent,ref, watch } from 'vue'
import { ConsumeView,ChargeView,api, MemberView } from './models'
import { dateTimeStr } from './utils'
export default defineComponent({
    components:{
        MemberInfoBar
    },
   props:{'memberId':{type:String,required:true}},
    setup(props){
        const consumeRows = ref<Array<ConsumeView>>()
        const chargeRows = ref<Array<ChargeView>>()
        const member = ref<MemberView>()
        const tab = ref('info')
        return {
            member,
            splitterModel:ref(80),
            show:async ()=>{
                tab.value = 'info'
                member.value = await api.memberAPI.get(props.memberId)
                consumeRows.value = await api.consumeAPI.getConsumeList(props.memberId)
                chargeRows.value = await api.memberAPI.getChargeList(props.memberId)
            },
            tab,
            consumeRows,
            consumeColumns:[
                { label:'时间',field:'time',name:'time',
                format:dateTimeStr},
                { label:'项目',field:'product',name:'product',
                format:(p:Array<{name:string,count:number}>)=>{
                    let result = ''
                    p.forEach((pv)=>{ result += `${pv.name}x${pv.count} `})
                    return result
                }},
                { label:'金额',field:'price',name:'price'},
            ],
            chargeRows,
            chargeColumns:[
                { label:'时间',field:'time',name:'time',format:dateTimeStr},
                { label:'项目',field:'card',name:'card',
                format:(v:string,row:Object)=>{
                    const c = row as ChargeView
                    return (c.card?c.card:'') + (c.amount?` 单充${c.amount}元`:'')
                }
                },
                {label:'支付',field:'pay',name:'pay'}
            ]
        }
    }
})
</script>

<style>

</style>