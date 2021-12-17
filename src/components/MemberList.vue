<template>
<div class="full-width full-height q-pl-md q-pt-md">
    <!-- <div class="row q-gutter-sm">
        <q-input class="q-ml-none" outlined  label="手机号/姓名" v-model='keyword'></q-input>
        <q-btn color="primary" label="查询" @click="getMembers"></q-btn>
        <q-btn color="secondary" label="开卡" @click="newmember = true"></q-btn>
    </div> -->
    <q-table flat grid class="full-height"
    :rows="rows"
    :rows-per-page-options="[10, 20,50,100]"
    rows-per-page-label="每页条数"
    no-results-label="无数据"
    no-data-label="无数据"
    loading-label="加载中"
    row-key="no">
        <template v-slot:item="props">
        <q-card class="q-mr-md q-mb-md">
            <q-card-section class="bg-primary text-white q-pb-sm q-pt-sm">
                <div class="row">
                    <div class="col-md-auto text-bold q-pr-xs">{{props.row.name}} </div>
                    <div class="col text-caption"> {{props.row.phone}}</div>
                </div>
            </q-card-section>
            <q-card-section class="q-pb-sm q-pt-sm">
               
                <div class="text-caption">卡号:{{props.row.no}}</div>
                <div class="text-caption">余额:{{props.row.balance}}</div>
                <div class="text-caption">开卡时间:{{dateStr(props.row.newCardTime)}}</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions align="around">
                <q-btn-group flat>
                <q-btn size="sm"  @click="memberId = props.row._id;consume = true">
                    <q-icon name="credit_card"></q-icon> &nbsp;划卡</q-btn>
                <q-btn size="sm"  @click="memberId = props.row._id;charge = true">
                    <q-icon name="paid"></q-icon> &nbsp;充值
                </q-btn>
                <q-btn size="sm"   @click="memberId = props.row._id;memberinfo = true">
                    <q-icon name="list"></q-icon> &nbsp;详情
                </q-btn>
                </q-btn-group>
            </q-card-actions>
        </q-card>    
        </template>
    </q-table>
   
   
</div>

<consume v-model="consume" :memberId="memberId" @finished="getMembers"></consume>
<member-info v-model="memberinfo" :memberId="memberId"></member-info>
<charge v-model="charge" :memberId="memberId" @finished="getMembers"></charge>
</template>

<script lang="ts">
import { defineComponent,ref,onMounted,watch } from 'vue'
import Charge from './Charge.vue'
import Consume from './Consume.vue'
import MemberInfo from './MemberInfo.vue'
import axios from 'axios'

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
        const getMembers =  async () =>{
            await axios.get('')
            members.value = await window.memberAPI.all(props.search)
        }
        
        onMounted(getMembers)
        watch(props,getMembers)
        return {
            member,
            memberId:ref(''),
            rows:members,
            getMembers, 
            consume:ref(false),
            memberinfo:ref(false),
            charge:ref(false),
        }
    }
})
</script>

<style>

</style>