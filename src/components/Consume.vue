<template>
<q-dialog v-model="value" persistent>
    <q-card class="" style="">
        <q-bar class="bg-primary text-white">
          <div>划卡</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="">
<div class="q-gutter-md">
        <member-info-bar></member-info-bar>
        
        <p class="q-mb-none q-mt-none">消费项目</p>
        <div style="min-width:400px" class="q-mt-none">
        <q-table
        grid
        flat
        rows-per-page-options="0"
        hide-bottom
        row-key="name"
        v-model:selected="selected"
        class="q-mt-none"
        selection="multiple" 
        :rows="rows" 
        :columns="columns">
        <template v-slot:item="props">
            <q-card class="q-ma-sm" tag="label" v-bind:class="{'bg-primary text-white':props.selected}">
                    <q-card-section horizontal class="text-center q-pa-sm">
                    <p class="q-mb-none">{{props.row.name}}</p>
                    <p class="q-mb-none">￥{{props.row.price}}</p>
                </q-card-section>
                <q-separator />
                <q-card-section class="text-center q-pa-xs">
                    <q-checkbox dense v-model="props.selected"/>
                    </q-card-section>
            </q-card>
        </template>
        </q-table>
        </div>
        <employee-options></employee-options>
        </div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="保存" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>
</template>

<script lang="ts">
import EmployeeOptions from './EmployeeOptions.vue'
import MemberInfoBar from './MemberInfoBar.vue'
import {defineComponent} from 'vue'
export default defineComponent( {
  components: { EmployeeOptions,MemberInfoBar },
  props:{
        modelValue:Boolean
    },
    computed:{
        value:{
            get(){
                return this.modelValue
            },
            set(value:boolean){
                this.$emit('update:modelValue',value)
            }
        }
    },
    data(){
        return {
            selected:[],
            rows:[
                {name:'头疗',price:48},
                {name:'眼疗',price:30},
                {name:'姜疗',price:48},
                {name:'冰疗',price:55},
                {name:'发疗',price:98},
                {name:'头皮养护',price:88},
                {name:'面膜',price:30}
            ],
            columns:[
                { label:'项目',field:'name'},
                { label:'价格',field:'price'}
            ]
        }
    }
})
</script>

<style>
</style>