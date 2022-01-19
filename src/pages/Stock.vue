<template>
<q-page padding>
    <div class="row q-gutter-md">
        <q-card :key="row._id" v-for="row of rows">
            <q-card-section class="row items-baseline">
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
    <q-card-section class="bg-teal text-white">
        <div class="text-h6">{{row.name}}{{title}}</div>
    </q-card-section>
    <q-card-section class="row">
        <q-input style="width:200px;" input-class="text-right text-h5" v-model.number="number" type="number">
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
        <q-btn icon="done" @click="submit" color="teal" round flat></q-btn>
    </q-card-actions>
</q-card>
</q-dialog>

</template>

<script lang="ts">
import { api, Stock } from "../components/models";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    setup(){
        const showDialog = ref(false)
        const title = ref('')
        const row = ref()
        const number = ref(1)
        const submit = ref()
        const rows = ref<Stock[]>()
        const dialog = (r:Stock,t:string,s:()=>void)=>{
                number.value = 1
                row.value = r
                title.value = t
                showDialog.value = true
                submit.value = s
            }


        onMounted(async()=>{
            rows.value = await api.stockAPI.getAll()
        })
        return {
            showDialog,
            title,
            row,
            number,
            submit,
            rows,
            
            inStock:(r:Stock)=>{
                dialog(r,'入库',()=>{
                    console.log('入库')
                })
            },
            outStock:(r:Stock)=>{
                dialog(r,'出库',()=>{
                    console.log('出库')
                })
            }
        }
    }
})
</script>

<style>

</style>