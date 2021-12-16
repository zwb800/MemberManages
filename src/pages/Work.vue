<template>
<div class="q-pt-md q-pl-md">
<div class="row q-gutter-sm">
<q-input stack-label v-model="startDate" label="开始时间" type="date"></q-input>
<q-input stack-label label="结束时间" v-model="endDate" type="date"></q-input>
<q-btn-group class="q-mt-lg">
<q-btn-toggle  v-model="modelMonth" :options="[{label: '本月', value: 'month'}]" @click="month()"></q-btn-toggle>
<q-btn-toggle   v-model="modelToday" :options="[{label: '今天', value: 'today'}]" @click="today()"></q-btn-toggle>
<q-btn label="前一天" @click="prevDay()"></q-btn>
<q-btn label="后一天" @click="nextDay()"></q-btn>
</q-btn-group>
</div>
<q-table class="q-mt-md" hide-pagination grid :rows="rows">
    <template  v-slot:item="table">
        <q-card class="q-mr-md q-mb-md">
            <q-card-section>
                <div class="row">
                <div class="col text-h6">{{table.row.employee}}</div> 
                <div class="text-caption q-pt-sm">
                    <template :key="s" v-for="s of serviceItems">
                        {{headNumber(table.row,s.shortName)}}
                    </template>
                    </div>
                </div>
            </q-card-section>
            <template v-if="table.row.consumers.length>0">
            <q-separator></q-separator>
             <q-card-section>
                 <div :key="c" v-for="c of table.row.consumers">
                    <q-btn flat @click="memberId = c._id;memberinfo = true">
                        {{c.name}}<template :key="i" v-for="i of c.items">+{{i}}</template>
                    </q-btn>
                 </div>
            </q-card-section>
            </template>
        </q-card>
    </template>
</q-table>
</div>
<member-info v-model="memberinfo" :memberId="memberId"></member-info>
</template>


<script lang="ts">
import { ServiceItem, WorkView } from 'src/components/models'
import { defineComponent,ref,onMounted,watch,computed } from 'vue'
import MemberInfo from 'src/components/MemberInfo.vue'
export default defineComponent({
    components:{MemberInfo},
    setup(){
        const today = new Date()

        const todayStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
        const startDate = ref(todayStr)
        const endDate = ref(todayStr)
        const rows = ref()
        const serviceItems = ref(Array<ServiceItem>())
        const getRows = async()=>{
            rows.value = await window.employeeAPI.work(
                new Date(startDate.value),
                new Date(endDate.value+' 23:59:59'))
                
            serviceItems.value = await window.serviceItemAPI.all()
        }

        onMounted(getRows)

       

        watch([startDate,endDate],getRows)

        const dateStr = (date:Date)=>{
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate().toString().padStart(2,'0')}`
        }

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
            rows,
            serviceItems,
            modelToday,
            modelMonth,
            memberId:ref(''),
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