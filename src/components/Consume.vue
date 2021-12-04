<template>
<q-dialog ref="dialog" @before-show="show" v-model="value" persistent>
    <q-card >
        <q-bar class="bg-primary text-white">
          <div>划卡</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <q-form @submit="submit" greedy>
        <q-card-section class="">
<div class="q-gutter-md">
        <member-info-bar :member="member"></member-info-bar>
        
        <p class="q-mt-none">消费项目</p>
        <div style="min-width:400px" class="q-mt-none">
            
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
     
          
        <p>头疗师</p>
        <btn-toggle class="q-mt-none" :options="employee"></btn-toggle>
        <div class="row q-gutter-sm q-mt-none">
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
         </q-form>
    </q-card>
</q-dialog>
</template>

<script lang="ts">
import MemberInfoBar from './MemberInfoBar.vue'
import {defineComponent,ref,onMounted,toRaw} from 'vue'
import { QDialog } from 'quasar'
import BtnToggle  from './BtnToggle.vue'
interface option{
    // value:Employee;
    label:string;
    selected:boolean;
}

export default defineComponent( {
  components: { MemberInfoBar,BtnToggle },
  props:{'member':{type:Object,required:true}},
   
    setup(props,context){
        const employee = ref<Array<option>>()

        const rows = ref<
        Array<{_id:string,name:string,count:number}>>()


        const init= async ()=>{
            employee.value = (await window.employeeAPI.all()).map((e)=>{
                            return {
                                // value:e,
                                label:e.name,
                                selected:false,
                                items:[
                    {label:'头'},
                    {label:'眼'},
                    {label:'面'},
                    {label:'姜'},]
                            }
                        })

            rows.value = (await window.serviceItemAPI.all())
                .map(((e)=>{
                    return {
                        _id:e._id,
                        name:e.name,
                        count:0
                    }
                }))
        }

        onMounted(init)
        const dialog = ref<QDialog>()
        return {
            employee,
            show:async ()=>{
                await init()
            },
            submit:async ()=>{
                if(rows.value!=undefined)
                {
                    const selectedItems = (rows.value.filter(p=>p.count>0))
                    const insertedId = await window.memberAPI.consume(props.member._id,
                    selectedItems.map(p=>toRaw(p)))

                    dialog.value?.hide()
                    context.emit.call(null,'consumed')
                    console.log(insertedId)
                }

                
            },
            dialog,
            selected:[],
            rows
        }
    }
})
</script>

<style>
</style>