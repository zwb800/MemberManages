<template>
<q-dialog v-model="value" persistent>
    <q-card class=""  >
        <q-bar class="bg-primary text-white">
          <div>划卡 {{member.name}} {{member.phone}}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-card-section class="">
<div class="q-gutter-md">
        <member-info-bar :member="member"></member-info-bar>
        
        <p class="q-mt-none">消费项目</p>
        <div style="min-width:400px" class="q-mt-none">
        <!-- <q-table
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
             <q-card class="q-ma-xs cursor-pointer" tag="label" v-bind:class="{'bg-primary text-white':props.selected}">
                <q-card-section horizontal class="text-center q-pa-sm">
                    <p class="q-mb-none">{{props.row.name}}</p>
                    <p class="q-mb-none">￥{{props.row.price}}</p>
                    <q-checkbox class="hidden" dense v-model="props.selected"/>
                </q-card-section>
            </q-card> 
            
        </template>
        </q-table> -->
        <q-btn-group>
        <template :key="row.name" v-for="row in rows">
        <q-btn v-if='row.count>0'
                color='primary' 
                :label='row.name+"("+row.count+")"'
                @click.left='row.count++'
                 @click.right='row.count--'></q-btn>
                <q-btn v-else
                :label='row.name'
                @click.left='row.count++'></q-btn>
                </template>
        </q-btn-group>
        </div>
     
          
        <p class="q-mb-none">头疗师</p>
        <btn-toggle :options="employee"></btn-toggle>
        <div class="row q-gutter-sm">
         <template :key="e.name" v-for="e in employee.filter(e=>e.selected)">
            <div>
            <p class="q-mb-sm">{{e.label}}</p>
            <div>
                <btn-toggle
                :options="e.items"></btn-toggle>
            </div>
            </div>
            
        </template>
        </div>
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
import MemberInfoBar from './MemberInfoBar.vue'
import {defineComponent,ref,onMounted,watch} from 'vue'
import { Employee } from './models'
import BtnToggle  from './BtnToggle.vue'
interface option{
    // value:Employee;
    label:string;
    selected:boolean;
}

export default defineComponent( {
  components: { MemberInfoBar,BtnToggle },
  props:['member'],
   
    setup(props){
        const employee = ref<Array<option>>()
        onMounted(async ()=>{
            employee.value = (await window.employeeAPI.all()).map((e)=>{
                            return {
                                // value:e,
                                label:e.name,
                                selected:false,
                                items:[
                    {label:'头'},
                    {label:'眼'},{label:'面'},{label:'姜'},]
                            }
                        })
        })

  
        return {
            employee,
            show:()=>{
                console.log(props.member)
            },
            selected:[],
            rows:ref([
                {name:'头疗',price:48,count:0},
                {name:'眼疗',price:30,count:0},
                {name:'面膜',price:30,count:0},
                {name:'姜疗',price:48,count:0},
                {name:'冰疗',price:55,count:0},
                {name:'发疗',price:98,count:0},
                {name:'头皮养护',price:88,count:0},
                
            ])
        }
    }
})
</script>

<style>
</style>