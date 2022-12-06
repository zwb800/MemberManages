<template>
<q-page padding>
<div class="row items-center q-gutter-sm">
<q-input stack-label v-model="startDate" label="开始时间" type="date"></q-input>
<q-input stack-label label="结束时间" v-model="endDate" type="date"></q-input>
<q-btn-group>
<q-btn-toggle  toggle-color="teal"  v-model="modelMonth" :options="[{label: '本月', value: 'month'}]" @click="month()"></q-btn-toggle>
<q-btn-toggle  toggle-color="teal" v-model="modelToday" :options="[{label: '今天', value: 'today'}]" @click="today()"></q-btn-toggle>
<q-btn label="前一天" @click="prevDay()"></q-btn>
<q-btn label="后一天" @click="nextDay()"></q-btn>
</q-btn-group>

<q-btn label="导出到微信" @click="exportDialog = true"></q-btn>
</div>
<div class="q-pt-sm" v-if="footer">
    <q-chip icon="group" color="primary" text-color="white" class="q-ml-none" square>总 {{ footer.sum}}</q-chip>
    <q-chip icon="person" color="teal" text-color="white" square>新 {{footer.new}}</q-chip>
    <template :key="f" v-for="f of footer.items">
        <q-chip square>{{f.label}} {{f.count}}</q-chip>
    </template>
    <br>
    <q-chip class="q-ml-none" icon="card_membership" color="orange" text-color="white" square>办卡 {{footer.cardCount}}</q-chip>
    <q-chip icon="payment" square>办卡业绩 {{footer.cardPrice}}</q-chip>
    <q-chip icon="currency_yen" square>其它业绩 {{footer.otherPrice}}</q-chip>
    <q-chip icon="account_balance_wallet" color="pink" text-color="white" square>总业绩 {{footer.cardPrice+footer.otherPrice}}</q-chip>
    <q-chip icon="trending_up" color="red" text-color="white" square>销售额 {{footer.sale}}</q-chip> 
</div>

<div class="row q-gutter-md q-mt-sm items-stretch">
    <template  :key="row" v-for="row of rows">
        <q-card class="q-mt-none q-mb-md" v-if="row.consumers.length>0 || row.charges.length>0">
            <q-card-section>
                <div class="row">
                <div class="text-h6">{{row.employee}}</div> 
                <div class="text-caption q-pl-sm q-pt-sm">
                    <template :key="s" v-for="s of serviceItems">
                        {{headNumber(row,s.shortName)}}
                    </template>
                    </div>
                </div>
            </q-card-section>
            <template v-if="row.consumers.length>0">
            <q-separator></q-separator>
             <q-card-section>
                 <div :key="c" v-for="c of row.consumers">
                    <q-btn flat @click="memberId = c.id;memberinfo = true">
                        {{c.name}}<template :key="i" v-for="i of c.items">+{{i}}</template>
                    </q-btn>
                 </div>
            </q-card-section>
            </template>

            <template v-if="row.charges.length>0">
            <q-separator></q-separator>
             <q-card-section>
                 <div :key="c" v-for="c of row.charges">
                    <q-btn flat @click="memberId = c.id;memberinfo = true">
                        {{c.name}} 
                        {{c.card?c.card.label:''}} {{c.commission}}
                    </q-btn>
                 </div>
            </q-card-section>
            </template>
        </q-card>
        
    </template>
    
</div>
</q-page>
<member-info v-model="memberinfo" :memberId="memberId"></member-info>
<export-dialog :data="footer" :work="rows" v-model="exportDialog"></export-dialog>
</template>


<script lang="ts">
import { ServiceItem, WorkView,api, FooterView } from '../components/models'
import { defineComponent,ref,onMounted,watch,computed } from 'vue'
import MemberInfo from '../components/MemberInfo.vue'
import {dateStr} from '../components/utils'
import ExportDialog from '../components/Export.vue'
export default defineComponent({
    components:{ MemberInfo,  ExportDialog },
    setup(){
        const today = new Date()
        const footer = ref<FooterView>()
        const todayStr = dateStr(today)
        const startDate = ref(todayStr)
        const endDate = ref(todayStr)
        const rows = ref()
        const serviceItems = ref(Array<ServiceItem>())

        const getRows = async()=>{
            const sDate = new Date(startDate.value)
            const eDate = new Date(endDate.value+' 23:59:59')
            const result = await api.employeeAPI.work(sDate,eDate)
            rows.value = result.rows
            footer.value = result.footer
        }

        onMounted(async()=>{
            serviceItems.value = await api.serviceItemAPI.all()
            await getRows()
        })

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
            exportDialog:ref(false),
            startDate,
            endDate,
            footer,
            rows,
            serviceItems,
            modelToday,
            modelMonth,
            memberId:ref(0),
            memberinfo:ref(false),
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
            headNumber:(row:WorkView,searchField:string)=>{
                let count = 0
                row.consumers.forEach(e => {
                    e.items.forEach(i=>{
                        count += (i == searchField?1:0)
                    })
                });
                return count>0?(searchField+count.toString()+' '):''
            }
        }
    }
})
</script>

<style>

</style>