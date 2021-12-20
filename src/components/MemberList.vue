<template>

    <!-- <q-table flat grid class="full-height"
    :rows="rows"
    :rows-per-page-options="[10, 20,50,100]"
    rows-per-page-label="每页条数"
    no-results-label="无数据"
    no-data-label="无数据"
    loading-label="加载中"
    row-key="no">
        <template v-slot:item="props"> -->
          
                
            <q-infinite-scroll ref="scroller" class="full-width" @load="onLoad">
                <div class="row justify-center q-gutter-md">
        <q-card class="" :key="row" v-for="row of rows">
            <q-card-section 
            @click="memberId = row._id;memberinfo = true" 
            class="cursor-pointer bg-primary text-white q-pb-sm q-pt-sm">
                <div class="row">
                    <div class="col-md-auto text-h6 q-pr-xs">{{row.name}} </div>
                    <div class="col q-pt-xs"> {{row.phone}}</div>
                </div>
            </q-card-section>
            <q-card-section @click="memberId = row._id;memberinfo = true" class="cursor-pointer q-gutter-sm">
                <div>卡号:{{row.no}}</div>
                <div>余额:{{row.balance}}</div>
                <div>开卡时间:{{dateStr(row.newCardTime)}}</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions align="evenly" class="bg-grey-2 q-pa-none">
                <q-btn-group flat>
                <q-btn padding="md" @click="memberId = row._id;consume = true">
                    <q-icon name="credit_card"></q-icon> &nbsp;划卡</q-btn>
                <q-btn padding="md" @click="memberId = row._id;charge = true">
                    <q-icon name="paid"></q-icon> &nbsp;充值
                </q-btn>
                </q-btn-group>
            </q-card-actions>
        </q-card>    
        </div>
        <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
            </q-infinite-scroll>
           
        <!-- </template>
    </q-table> -->
   
   


<consume v-model="consume" :memberId="memberId" @finished="getMembers"></consume>
<member-info v-model="memberinfo" :memberId="memberId"></member-info>
<charge v-model="charge" :memberId="memberId" @finished="getMembers"></charge>
</template>

<script lang="ts">
import { QInfiniteScroll } from 'quasar'
import { defineComponent,ref,onMounted,watch } from 'vue'
import Charge from './Charge.vue'
import Consume from './Consume.vue'
import MemberInfo from './MemberInfo.vue'

import './models'
import { Member } from './models'


export default defineComponent({
  components: {  Consume,MemberInfo, Charge },
 props:{search:{type:String,default:''}},
   methods:{
        dateStr (d:Date)
        {
            return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
        },
    },
     setup(props){
        const member = ref<Member|undefined>()
        const members = ref(Array<Member>())
        const pageSize = 20

        const get = async(index:number)=>{
            return await window.memberAPI.all(
                props.search,index,pageSize)
        }

        const onLoad =  async (
            index=1,
            done:((stop:boolean)=>void)|undefined=undefined) =>{
            const newArr = await get(index)
            members.value = members.value.concat(newArr)
            if(done)
                done(newArr.length < pageSize)
        }

        const scroller = ref<QInfiniteScroll>()
        
        // onMounted(onLoad)
        watch(props,async ()=>{
            const newArr =await get(1)
            members.value = newArr

            // members.value = []
            // if(scroller.value)
            // {
            //     scroller.value.reset()
            //     scroller.value.poll()
            // }
        })
        return {
            member,
            scroller,
            memberId:ref(''),
            rows:members,
            onLoad, 
            consume:ref(false),
            memberinfo:ref(false),
            charge:ref(false),
        }
    }
})
</script>

<style>

</style>