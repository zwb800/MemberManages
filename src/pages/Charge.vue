<template>
<q-page padding>
<div class="row q-gutter-sm">
<q-input stack-label v-model="startDate" label="开始时间" type="date"></q-input>
<q-input stack-label label="结束时间" v-model="endDate" type="date"></q-input>
<q-btn-group class="q-mt-lg">
<q-btn-toggle  toggle-color="teal"  v-model="modelMonth" :options="[{label: '本月', value: 'month'}]" @click="month()"></q-btn-toggle>
<q-btn-toggle  toggle-color="teal" v-model="modelToday" :options="[{label: '今天', value: 'today'}]" @click="today()"></q-btn-toggle>
<q-btn label="前一天" @click="prevDay()"></q-btn>
<q-btn label="后一天" @click="nextDay()"></q-btn>
</q-btn-group>
</div>
  <q-table row-key="_id" class="q-mt-sm" flat bordered :rows-per-page-options="[0]" :rows='rows' :columns="columns">
  <template v-slot:body-cell-id="props">
        <q-td :props="props">
            <q-btn flat color="primary" @click="refund(props.value)" 
             label="撤单" ></q-btn>
        </q-td>
      </template>
  </q-table>

</q-page>
</template>

<script lang='ts'>
import {api, ChargeView } from '../components/models'

import { defineComponent,ref,watch,computed,onMounted } from 'vue'
import { dateTimeStr,dateStr } from '../components/utils'
import { useQuasar } from 'quasar'
export default defineComponent({
    setup(){
        const $q = useQuasar()
        const today = new Date()
        const todayStr = dateStr(today)
        const startDate = ref(todayStr)
        const endDate = ref(todayStr)
        const rows = ref()
        const getRows = async()=>{
            const sDate = new Date(startDate.value)
            const eDate = new Date(endDate.value+' 23:59:59')
            rows.value = await api.memberAPI.getAllChargeList(sDate,eDate)
        }

        onMounted(getRows)

        watch([startDate,endDate],getRows)

        const modelToday = computed(()=>startDate.value == dateStr(new Date())?'today':null)
        const modelMonth = computed(()=>{
            const date = new Date()
            date.setDate(1)
            const strStart = dateStr(date)
            date.setMonth(date.getMonth()+1)
            date.setDate(date.getDate()-1)
            const strEnd  = dateStr(date)
            if(startDate.value == strStart && endDate.value == strEnd)
            {
                return 'month'
            }
            return null
        })


        return {
            startDate,
            endDate,
            modelToday,
            modelMonth,
            rows,
             today:()=>{
                const todayStr = dateStr(new Date())
                startDate.value = todayStr
                endDate.value = todayStr
            },
            month:()=>{
                const date = new Date()
                date.setDate(1)
               startDate.value = dateStr(date)
                
                date.setMonth(date.getMonth()+1)
                date.setDate(date.getDate()-1)
                endDate.value  = dateStr(date)
            },
            prevDay:()=>{
                const startD = new Date(startDate.value)
                startD.setDate(startD.getDate()-1)
                const prevStr = dateStr(startD)
                 startDate.value = prevStr
                endDate.value = prevStr
            },
            nextDay:()=>{
                const startD = new Date(startDate.value)
                startD.setDate(startD.getDate()+1)
                const nextStr = dateStr(startD)
                 startDate.value = nextStr
                endDate.value = nextStr
            },
            columns:[
                { label:'时间',name:'time',field:'time',format:dateTimeStr},
                {label:'会员',name:'member',field:'member'},
                 { label:'卡',field:'card',name:'card',format:(v:string,row:Object)=>{
                    const c = row as ChargeView
                    return (c.card?c.card:'') + (c.amount?` 单充${c.amount}元`:'')
                }},
                {label:'支付',field:'pay',name:'pay'},
                {name:'id', label:'操作',field:'_id'},
            ], 
            refund:async (id:string)=>{
                $q.dialog({
                    title:"确认",
                    message:"确认撤销吗？",
                    cancel:true
                })
                .onOk(async ()=>{
                    $q.loading.show()
                    const result = await api.memberAPI.refund(id)
                    if(result == ''){
                        await getRows()
                        $q.notify('操作成功')
                    }
                    else
                    {
                        $q.notify({
                            message:result,
                            type:'negative',
                            position:'center',
                            timeout:2000
                        })
                    }

                     $q.loading.hide()
                    
                })
                
            }
        }
    }
})
</script>

<style>

</style>