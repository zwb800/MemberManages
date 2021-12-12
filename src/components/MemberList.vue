<template>
<div class="full-width full-height q-gutter-md">
    <div class="row q-gutter-sm">
        <q-input class="q-ml-none" outlined  label="手机号/姓名" v-model='keyword'></q-input>
        <q-btn color="primary" label="查询" @click="getMembers"></q-btn>
        <q-btn color="secondary" label="开卡" @click="newmember = true"></q-btn>
    </div>
    <q-table flat grid class="full-height q-mt-sm"
    :rows="rows"
    :rows-per-page-options="[10, 20,50,100]"
    rows-per-page-label="每页条数"
    no-results-label="无数据"
    no-data-label="无数据"
    loading-label="加载中"
    row-key="no">
        <template v-slot:item="props">
        <q-card class="q-mr-md q-mb-md">
            <q-card-section class="q-pb-sm">
                <div class="row">
                    <div class="col-md-auto text-bold q-pr-xs">{{props.row.name}} </div>
                    <div class="col"> {{props.row.phone}}</div>
                </div>
                <div class="text-subtitle2">卡号:{{props.row.no}}</div>
                <div class="text-subtitle2">余额:{{props.row.balance}}</div>
                <div class="text-subtitle2">开卡时间:{{dateStr(props.row.newCardTime)}}</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions>
                <q-btn size="sm" color="primary" @click="member = props.row;consume = true">划卡</q-btn>
                <q-btn size="sm" color="secondary" @click="member = props.row;charge = true">充值</q-btn>
                <q-btn size="sm" color="info" @click="member = props.row;memberinfo = true">详情</q-btn>
            </q-card-actions>
        </q-card>    
        </template>
    </q-table>
   
   
</div>
<new-member v-model="newmember" @added="getMembers"></new-member>
<consume v-model="consume" :member="member" @finished="getMembers"></consume>
<member-info v-model="memberinfo" :member="member"></member-info>
<charge v-model="charge" :member="member"></charge>
</template>

<script lang="ts">
import { defineComponent,ref,onMounted,watch } from 'vue'
import Charge from './Charge.vue'
import Consume from './Consume.vue'
import MemberInfo from './MemberInfo.vue'
import NewMember from './NewMember.vue'
import './models'
import { Member } from './models'


export default defineComponent({
  components: { NewMember, Consume,MemberInfo, Charge },
 
   methods:{
        dateStr (d:Date)
        {
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        },
    },
     setup(){
        const member = ref<Member|undefined>()
        const members = ref(Array<Member>())
        const keyword = ref('')
        const getMembers =  async () =>{
            members.value = await window.memberAPI.all(keyword.value)
        }
        
        onMounted(getMembers)
        watch(keyword,getMembers)
        return {
            member,
            rows:members,
            getMembers, 
            keyword,
            newmember:ref(false),
            consume:ref(false),
            memberinfo:ref(false),
            charge:ref(false),
        }
    }
})
</script>

<style>

</style>