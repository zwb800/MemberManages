<template>
<q-page padding>
    <div class="row q-gutter-md">
        <q-card :key="row._id" v-for="row of rows">
            <q-card-section @click="showDetail(row)" class="cursor-pointer row items-baseline">
                <div class="text-h6">{{row.name}}</div>
                <div class="q-ml-xs">{{row.count}} {{row.unit}}</div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions align="evenly" class="bg-grey-2 q-pa-none">
                <q-btn-group flat>
                    <q-btn title="入库" @click="inStock(row)" padding="md">
                        <q-icon name="login"></q-icon>&nbsp;入库
                    </q-btn>
                      <q-btn title="出库" @click="outStock(row)" padding="md">
                        <q-icon name="logout"></q-icon>&nbsp;出库
                    </q-btn>
                </q-btn-group>
            </q-card-actions>
        </q-card>
    </div>
</q-page>

<q-dialog v-model="showDialog" persistent>
<q-card>
    <q-card-section  class="bg-teal text-white">
        <div class="text-h6">{{row.name}} {{title}}</div>
    </q-card-section>
    <q-card-section class="row">
        <q-input style="width:200px;" input-class="text-center text-h5" v-model.number="number" type="number">
            <template v-slot:before>
                <q-btn round icon="remove" @click="number = number>1?number-1:1"></q-btn>
            </template>
            <template v-slot:after>{{row.unit}}
                &nbsp;
                <q-btn round  icon="add" @click="number++"></q-btn>
            </template>
            <template v-slot:append>
                
            </template>
        </q-input>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-actions align="right">
        <q-btn icon="close" v-close-popup round flat></q-btn>
        <q-btn :loading="loading" icon="done" @click="submit" color="teal" round flat></q-btn>
    </q-card-actions>
</q-card>
</q-dialog>

<q-dialog v-model="detailDialog">
    <q-card>
        <q-card-section class="row q-pa-none bg-teal text-white">
            <div class="text-h6 q-ml-md q-mt-md">出/入库记录</div>
            <q-space />
            <q-btn class="q-mb-md q-mr-sm q-mt-sm" round flat icon="close" v-close-popup></q-btn>
        </q-card-section>
        <q-card-section class="q-pa-none row">
            <q-table flat title="入库" :rows-per-page-options="[10,20,50,100]" :columns="logColumns" :rows="inLogs"></q-table>
            <q-separator vertical></q-separator>
            <q-table flat title="出库" :rows-per-page-options="[10,20,50,100]" :columns="logColumns" :rows="outLogs"></q-table>
        </q-card-section>
    </q-card>
</q-dialog>
<q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab color="primary" icon="add" @click="openAddStockDialog()"></q-btn>
</q-page-sticky>
<q-dialog v-model="newStock">
    <q-card>
         <q-card-section  class="bg-primary text-white">
            <div class="text-h6">添加商品</div>
        </q-card-section>
        <q-form  @submit="addStock()" autofocus greedy>
        <q-card-section>
            <q-input v-model="stockName" label="产品名"
            :rules="[ val => val && val.length > 0 || '请填写产品名'] "></q-input>
            <q-input v-model="unit" label="包装"
            :rules="[ val => val && val.length > 0 || '请填写包装 例:盒、袋、瓶'] "></q-input>
        </q-card-section>
         <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn icon="close" v-close-popup round flat></q-btn>
            <q-btn type="submit" :loading="loading" icon="done" color="teal" round flat></q-btn>
        </q-card-actions>
        </q-form>
    </q-card>
</q-dialog>
</template>

<script lang="ts">
import { api, Stock, StockLog } from "../components/models";
import { defineComponent, onMounted, ref, watch } from "vue";
import { dateTimeStr } from "../components/utils";
import { useQuasar } from "quasar";

export default defineComponent({
    setup(){
        const $q = useQuasar()
        const showDialog = ref(false)
        const title = ref('')
        const row = ref<Stock>({_id:'',name:'',unit:'',count:0})
        const number = ref(1)
        const submit = ref()
        const rows = ref<Stock[]>()
        const inLogs = ref<StockLog[]>()
        const outLogs = ref<StockLog[]>()
        const detailDialog = ref(false)
        const loading = ref(false)
        const newStock = ref(false)
        const stockName = ref('') 
        const unit = ref('')

        let logsData = Array<StockLog>()
        const dialog = (r:Stock,t:string,s:()=>void)=>{
                number.value = 1
                row.value = r
                title.value = t
                showDialog.value = true
                submit.value = s
            }

        const load = async()=>{
            rows.value = await api.stockAPI.getAll()
        }

        
        const filterLog =(v:string) => {
            return logsData.filter(l=>v == 'outS'? l.count<0:l.count>0)
            
        }

        const updateStock = async (n:number)=>{
            loading.value = true
            if(row.value?._id)
                await api.stockAPI.update(row.value._id,n)
            await load()
            showDialog.value = false
            loading.value = false
        }

        onMounted(load)
        return {
            loading,
            inLogs,
            outLogs,
            showDialog,
            detailDialog,
            title,
            row,
            number,
            submit,
            rows,
            newStock,
            stockName,
            unit,
            logColumns:[
                { label:'时间',field:'time',name:'time',format:dateTimeStr},
                { label:'数量',field:'count',name:'count',format:(v:number)=>Math.abs(v)}
            ],
            inStock:(r:Stock)=>{
                dialog(r,'入库',async ()=>{
                   await updateStock(number.value)
                })
            },
            outStock:(r:Stock)=>{
                dialog(r,'出库',async ()=>{
                    await updateStock(number.value*-1)
                })
            },

           
            showDetail:async (r:Stock)=>{
                const logsData = await api.stockAPI.getLogs(r._id)
                inLogs.value = logsData.filter(l=>l.count>0)
                outLogs.value = logsData.filter(l=>l.count<0)
                detailDialog.value = true
            },
            openAddStockDialog:()=>{
                stockName.value = ''
                unit.value = ''
                newStock.value = true
            },
            addStock:async ()=>{
                loading.value = true
                const result = await api.stockAPI.add(stockName.value,unit.value)
                if(result.id){
                    $q.notify('创建成功')
                    await load()
                }
                else
                {
                     $q.notify({
                         message:result,
                         type:'negative'
                     })
                }
                loading.value = false
                newStock.value = false
            },
        }
    }
})
</script>

<style>

</style>