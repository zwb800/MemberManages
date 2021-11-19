<template>
<q-btn-group>
  <template :key="row.value" v-for="row in options">
            <q-btn @click="selected = 0" :color="toggleColor" v-if='row.value == selected' :label='row.label'></q-btn>
            <q-btn @click="selected = row.value" v-else :label='row.label'></q-btn>
        </template>
</q-btn-group>
</template>

<script lang='ts'>
import { defineComponent,ref,watch } from 'vue'
export default  defineComponent ({
    props:['options','toggleColor','modelValue'],
    emits:['update:modelValue'],
    setup(props,context){
        const selected = ref<number>(props.modelValue)
        watch(selected,()=>{
            context.emit('update:modelValue',selected.value)
        })
        return {
            selected
        }
    }
})
</script>

<style>

</style>