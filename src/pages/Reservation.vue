<template>
<q-page padding>
  <q-table row-key="_id" class="q-mt-sm" flat bordered :rows-per-page-options="[0]" :rows='rows' :columns="columns">
  <template v-slot:body-cell-id="props">
        <q-td :props="props">
            <q-btn flat color="primary" @click="cancel(props.value)" 
             label="取消" ></q-btn>
        </q-td>
      </template>
  </q-table>

</q-page>
</template>

<script lang='ts' setup>
import {api, Member } from '../components/models'

import { ref,onMounted } from 'vue'
import { dateTimeStr } from '../components/utils'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const rows = ref()
const getRows = async()=>{

    rows.value = await api.reservation.all()

    setTimeout(()=>{getRows().then(null,null)},15*60*1000)
}

onMounted(getRows)

const columns = ref([
    { label:'时间',name:'time',field:'time',format:dateTimeStr},
    {label:'会员',name:'member',field:'member',format:(m:Member)=>m.name},
    {label:'手机号',name:'phone',field:'member',format:(m:Member)=>m.phone},
    {label:'人数',name:'num', field:'num'},
    {name:'id', label:'操作',field:'_id'},
])

const cancel = (id:string)=>{

    $q.dialog({
        title:'确认',
        message:'确认撤销吗？',
        cancel:true
    })
    .onOk(()=>{
        $q.loading.show()
        api.reservation.cancel(id).then(async (result)=>{
            if(result){
                await getRows()
                $q.notify('操作成功')
            }
            else
            {
                $q.notify({
                    message:'操作失败',
                    type:'negative',
                    position:'center',
                    timeout:2000
                })
            }
        }).finally(()=>{
            $q.loading.hide()
        })
        
        
    })
    
}
</script>

<style>

</style>