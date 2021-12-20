<template>
<q-dialog ref="dialog" @before-show="show" persistent>
    <q-card >
       <q-card-section class="row q-pb-none">
          <div class="text-h6">划卡</div>
          <q-space />
          <q-btn round flat icon="close" v-close-popup></q-btn>
        </q-card-section>
        <q-form ref="form" @submit="submit" greedy>
        <q-card-section class="q-pt-none">
<div>
        <member-info-bar :memberId="memberId"></member-info-bar>
        
        <p class="q-mb-none">消费项目</p>
        <div style="min-width:400px" class="q-mt-none">
            <q-field class="q-pb-none" v-model="serviceItems" :rules="[value=>value.some(p=>p.count>0)||'请选择消费项目']" borderless>
                <template v-slot:control>
        <q-btn-group>
        <template :key="row.label" v-for="row in serviceItems">
        <q-btn v-if='row.count>0'
                color='primary' 
                :label='row.label+"("+row.count+")"'
                @click.left='row.count++'
                 @contextmenu='row.count--;$event.preventDefault()'></q-btn>
                <q-btn v-else
                :label='row.label'
                @click.left='row.count++'
                @contextmenu='$event.preventDefault()'></q-btn>
                </template>
        </q-btn-group>
                </template>
            </q-field>
        </div>
     
          
        <p class="q-mb-none">头疗师</p>
        <q-field class="q-mt-none q-pb-none" v-model="employee"
         :rules="[value=>value.some(p=>p.selected)||'请选择头疗师']"
          borderless>
        <template v-slot:control>
            <btn-toggle class="q-mt-none" :options="employee"></btn-toggle>
              </template>
        </q-field>
        
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
import {defineComponent,ref,onMounted,computed} from 'vue'
import { useQuasar,QDialog,QForm} from 'quasar'
import BtnToggle  from './BtnToggle.vue'
import {api} from './models'


interface EmployeeOption{
    value:{_id:string};
    label:string;
    selected:boolean;
    items:Array<{value:string,label:string,selected:boolean}>;
}

interface ServiceItemOption{
    label:string,
    count:number,
    value:{serviceItemId:string,shortName:string}
}

export default defineComponent( {
  components: { MemberInfoBar,BtnToggle },
  props:{'memberId':{type:String,required:true}},
   emits:['finished'],
    setup(props,context){
        const employee = ref<Array<EmployeeOption>>()
        let initEmployee = Array<EmployeeOption>()

        const serviceItems = ref<Array<ServiceItemOption>>()
        let initRow =  new Array<ServiceItemOption>()

        const init = ()=>{
            employee.value = JSON.parse(
            JSON.stringify(initEmployee)) as Array<EmployeeOption>
            serviceItems.value = JSON.parse(JSON.stringify(initRow)) as 
            Array<ServiceItemOption>
        }

        onMounted(async ()=>{
             initRow = (await api.serviceItemAPI.all())
                .map(((e)=>{
                    return {
                        label:e.name,
                        count:e.name=='头疗'?1:0,
                        value:{serviceItemId:e._id,shortName:e.shortName}
                    }
                }))

            const eItems = initRow.map(e=>{
                return {
                    value:e.value.serviceItemId,
                    label:e.value.shortName,
                    selected:false,
                }
            })

            initEmployee = (await api.employeeAPI.all()).map((e)=>{
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
        const form = ref<QForm>()
        const $q = useQuasar()

        return {
            form,
            employee,
            show: ()=>{
                init()
            },
            submit:async ()=>{
                if(serviceItems.value!=undefined)
                {
                    let es = employee.value?.filter(p=>p.selected).map(p=>{
                        return {
                            employeeId:p.value._id,
                            items:p.items.filter(pp=>pp.selected).map(pp=>pp.value)
                        }
                    })

                    if(!es)
                        es = []

                    const selectedItems = (serviceItems.value.filter(p=>p.count>0))
                    const result = await api.consumeAPI.consume(props.memberId,
                    selectedItems.map((p)=>{
                        return {
                            serviceItemId:p.value.serviceItemId,
                            count:p.count
                        }
                    }),es)
                    
                    if(result)
                    {
                        dialog.value?.hide()
                        context.emit.call(null,'finished')

                        $q.notify({
                            message:'划卡成功',
                            type:'positive',
                            position:'center',
                            timeout:1000
                        })
                    }
                    else
                    {
                        dialog.value?.shake()
                        $q.notify({
                            message:'划卡失败，余额不足',
                            type:'negative',
                            position:'center',
                            timeout:2000
                        })
                    }
                }
            },
            dialog,
            isServiceItemValid:computed(()=>{
                if(serviceItems.value)
                return serviceItems.value.some(p=>p.count>0)
                else
                return false
            }),
            serviceItems
        }
    }
})
</script>

<style>
</style>