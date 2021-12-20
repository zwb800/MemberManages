<template>
<q-btn-group>
  <template :key="row.value" v-for="row in options">
           <q-btn :size="size" @click="row.selected = false" @click.right="row.selected = false" color="primary" v-if='row.selected' :label='row.label'></q-btn>
           <q-btn  :size="size" @click="row.selected = true" @click.right="row.selected = true" v-else :label='row.label'></q-btn>
        </template>
</q-btn-group>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

interface option{
    // value:Employee;
    label:string;
    selected:boolean;
}

export default  defineComponent ({
    props:['options','toggleColor','modelValue','size'],
    emits:['update:modelValue'],
    setup(){
        return {
            selected(v:option){
                v.selected = true
                // context.emit('update:modelValue',
                // rows.value)
            },
            unSelected(v:option){
                v.selected = false
            //    context.emit('update:modelValue',
            //     rows.value)
            }
        }
    }
})
</script>

<style>

</style>