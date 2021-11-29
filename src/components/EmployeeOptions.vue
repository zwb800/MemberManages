<template>
    <p class="q-mb-none">头疗师</p>
    <q-btn-group>
        <template :key="row.value" v-for="row in rows">
            <q-btn @click="unSelected(row)" color="primary" v-if='row.selected' :label='row.label'></q-btn>
            <q-btn @click="selected(row)" v-else :label='row.label'></q-btn>
        </template>
    </q-btn-group>
</template>

<script lang='ts'>
import {defineComponent,ref,onMounted,toRaw} from 'vue'
import { Employee } from './models'

interface option{
    value:Employee;
    label:string;
    selected:boolean;
}

export default defineComponent({
    props:['modelValue'],
    emits:['update:modelValue'],
    setup(props,context){
        
        const rows = ref<Array<option>>()
        onMounted(async ()=>{
            rows.value = (await window.employeeAPI.all()).map((e)=>{
                return {
                    value:e,
                    label:e.name,
                    selected:false
                }
            })
            
        })
    
        return {
           rows,
           selected(v:option){
                v.selected = true
                context.emit('update:modelValue',
                rows.value?.filter(i=>i.selected).map(i=>toRaw(i.value)))
            },
            unSelected(v:option){
                v.selected = false
                context.emit('update:modelValue',
                rows.value?.filter(i=>i.selected).map(i=>toRaw(i.value)))
            }
        }
    }
})
</script>

<style>

</style>