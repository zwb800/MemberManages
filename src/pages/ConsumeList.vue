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
  <q-table row-key="_id" class="q-mt-sm" flat bordered rows-per-page-options="0" :rows='rows' :columns="columns">
  <template v-slot:body-cell-id="props">
        <q-td :props="props">
            <q-btn flat color="primary" @click="cancel(props.value)" 
             label="撤单" ></q-btn>
        </q-td>
      </template>
  </q-table>

</q-page>
</template>

<script lang='ts'>
import {api } from 'src/components/models'

import { defineComponent,ref,watch,computed,onMounted } from 'vue'
import { dateTimeStr,dateStr } from '../components/utils'
export default defineComponent({
    setup(){
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
        const startDate = ref(todayStr)
        const endDate = ref(todayStr)
        const rows = ref()
        const getRows = async()=>{
            const sDate = new Date(startDate.value)
            const eDate = new Date(endDate.value+' 23:59:59')
            rows.value = await api.consumeAPI.getAllConsumeList(sDate,eDate)
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
                { label:'时间',field:'time',
                format:dateTimeStr},
                {label:'会员',field:'member'},
                { label:'项目',field:'product',
                format:(p:Array<{name:string,count:number}>)=>{
                    let result = ''
                    p.forEach((pv)=>{ result += `${pv.name}x${pv.count} `})
                    return result
                }},
                { label:'金额',field:'price'},
                {name:'id', label:'操作',field:'_id'},
            ], 
            cancel:async (id:string)=>{
                await api.consumeAPI.cancel(id)
            }
        }
    }
})
</script>

<style>

</style>