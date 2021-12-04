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
        <template :key="row.label" v-for="row in rows">
        <q-btn v-if='row.count>0'
                color='primary' 
                :label='row.label+"("+row.count+")"'
                @click.left='row.count++'
                 @click.right='row.count--'></q-btn>
                <q-btn v-else
                :label='row.label'
                @click.left='row.count++'></q-btn>
                </template>
        </q-btn-group>
        </div>
     
          
        <p>头疗师</p>
        <btn-toggle class="q-mt-none" :options="employee"></btn-toggle>
        <div class="row q-gutter-sm q-mt-none">
         <template :key="e.label" v-for="e in employee.filter(e=>e.selected)">
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
    value:{_id:string};
    label:string;
    selected:boolean;
    items:Array<{value:string,label:string,selected:boolean}>;
}

interface MultiSelectedOption{
    label:string,
    count:number,
    value:{_id:string,shortName:string}
}

export default defineComponent( {
  components: { MemberInfoBar,BtnToggle },
  props:{'member':{type:Object,required:true}},
   
    setup(props,context){
        const employee = ref<Array<option>>()
        let initEmployee = Array<option>()
        const rows = ref<
        Array<MultiSelectedOption>>()
        let initRow =  new Array<MultiSelectedOption>()
        const init = ()=>{
            employee.value = JSON.parse(
            JSON.stringify(initEmployee)) as Array<option>
            rows.value = JSON.parse(JSON.stringify(initRow)) as 
            Array<MultiSelectedOption>
        }

        onMounted(async ()=>{

             initRow = (await window.serviceItemAPI.all())
                .map(((e)=>{
                    return {
                        label:e.name,
                        count:0,
                        value:e
                    }
                }))

                const eItems = initRow.map(e=>{
                    return {
                          value:e.value._id,
                        label:e.value.shortName,
                        selected:false,
                    }
                })

            initEmployee = (await window.employeeAPI.all()).map((e)=>{
                            return {
                                value:e,
                                label:e.name,
                                selected:false,
                                items:
                                JSON.parse(JSON.stringify(eItems)) as 
                                Array<{value:string,label:string,selected:boolean}>
                            }
                        })

            

           

              init()
        })

        const dialog = ref<QDialog>()
        return {
            employee,
            show: ()=>{
                init()
            },
            submit:async ()=>{
                if(rows.value!=undefined)
                {
                    const es = employee.value?.filter(p=>p.selected).map(p=>{
                        return {
                            memberId:p.value._id,
                            items:p.items.filter(pp=>pp.selected).map(pp=>pp.value)
                            }
                    })

                    console.log(es)
                    const selectedItems = (rows.value.filter(p=>p.count>0))
                    const insertedId = await window.memberAPI.consume(props.member._id,
                    selectedItems.map((p)=>{
                        return {
                            _id:p.value._id,
                            count:p.count
                        }
                    }))
                    if(insertedId!=null)
                    {
                        dialog.value?.hide()
                        context.emit.call(null,'consumed')
                    }
                    
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