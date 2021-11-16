<template>
<div class="full-width full-height q-gutter-md">
    <div class="row q-gutter-sm">
        <q-input class="q-ml-none" outlined  label="手机号/姓名" v-model="keyword"></q-input>
        <q-btn color="primary" label="查询"></q-btn>
        <q-btn color="secondary" label="开卡" @click="newmember = true"></q-btn>
    </div>
    <q-table flat grid class="full-height"
    :rows="rows"
    :columns="columns"
    :rows-per-page-options="[10, 20,50,100]"
    rows-per-page-label="每页条数"
    row-key="no">
        <template v-slot:item="props">
        <q-card class="q-mr-sm">
            <q-card-section class="q-pb-sm">
                <div class="row">
                    <div class="col-md-auto text-bold q-pr-xs">{{props.row.name}} </div>
                    <div class="col"> {{props.row.phone}}</div>
                </div>
                <div class="text-subtitle2">卡号:{{props.row.no}}</div>
                <div class="text-subtitle2">余额:300</div>
                <div class="text-subtitle2">开卡时间:2021-10-2</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions>
                <q-btn size="sm" color="primary" @click="consume = true">划卡</q-btn>
                <q-btn size="sm" color="secondary" @click="charge = true">充值</q-btn>
                <q-btn size="sm" color="info" @click="memberinfo = true">详情</q-btn>
            </q-card-actions>
        </q-card>    
        </template>
    </q-table>
   
   
</div>

<q-dialog v-model="newmember" persistent>
    <q-card style="min-width:600px">
        <q-bar class="bg-secondary text-white">
          <div>开卡</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="">
            <new-member></new-member>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="保存" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>

<q-dialog v-model="consume" persistent>
    <q-card class="" style="">
        <q-bar class="bg-primary text-white">
          <div>划卡</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="">
            <consume></consume>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="保存" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>

<q-dialog v-model="memberinfo" persistent>
    <q-card class="full-width">
        <q-bar class="bg-info text-white">
          <div>会员详情</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="q-pb-none q-pt-none">
            <member-info></member-info>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="划卡" color="primary"></q-btn>
              <q-btn label="充值" color="secondary" ></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>

<q-dialog v-model="charge" persistent>
    <q-card style="min-width:600px">
        <!-- <q-card-section class="row q-pb-none">
            <div class="text-h6">充值</div>
            <div class="q-space"></div>
            <q-btn icon="close" class="" flat round dense v-close-popup />
        </q-card-section> -->
        <q-bar class="bg-secondary text-white">
          <div>充值</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">
            <charge></charge>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="保存" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>
  
  

</template>

<script>
import { defineComponent,ref } from 'vue'
import Charge from './Charge.vue'
import Consume from './Consume.vue'
import MemberInfo from './MemberInfo.vue'
import NewMember from './NewMember.vue'
import './models'


export default defineComponent({
  components: { NewMember, Consume,MemberInfo, Charge },
     setup(){
       
        const members = ref([])
        const getMembers =  async () =>{
            members.value = await window.memberAPI.all()
        }
        
        return {
            rows:members,
            getMembers, 
            keyword:'',
            columns:[
                {lable:'卡号',field:'no'},
                {label:'姓名',field:'name'},
                {label:'电话',field:'phone'},
                {label:'余额',field:'amount'},
            ],
            newmember:ref(false),
            consume:ref(false),
            memberinfo:ref(false),
            charge:ref(false),
        }
    },
    async mounted(){
        await this.getMembers()
    }
   
})
</script>

<style>

</style>