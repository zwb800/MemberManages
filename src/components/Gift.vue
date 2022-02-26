<template>
<q-dialog ref="dialog" @before-show="show" persistent>
    <q-card style="min-width:800px;">
       <q-card-section class="row q-pb-none">
          <div class="text-h6">赠送</div>
          <q-space />
          <q-btn round flat icon="close" v-close-popup></q-btn>
        </q-card-section>
        <q-form ref="form" @submit="submit" greedy>
        <q-card-section class="q-pt-none">
<div>
        <p class="q-mb-none">赠送项目</p>
        <div class="q-mt-none">
            <q-field class="q-pb-none" v-model="serviceItems" :rules="[value=>value.some(p=>p.count>0)||'请选择赠送项目']" borderless>
                <template v-slot:control>
        <q-btn-group class="">
        <template :key="row.label" v-for="row in serviceItems">
        <q-btn v-if='row.count>0'
                color='primary' 
                @click.left='row.count++'
                 @contextmenu='row.count--;$event.preventDefault()'>
                  <span class="text-no-wrap">{{row.label}}</span>
                 &nbsp;{{row.count}}
                 </q-btn>
                <q-btn class="q-pt-md q-pb-md" v-else
                @click.left='row.count++'
                @contextmenu='$event.preventDefault()'>
                <span class="text-no-wrap">{{row.label}}</span>
                </q-btn>
                </template>
        </q-btn-group>
                </template>
            </q-field>
        </div>
        </div>
        
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="保存" :loading="submitting" type="submit" color="primary"></q-btn>
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
import {api, MemberView} from './models'


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

        const serviceItems = ref<Array<ServiceItemOption>>()
        let initRow =  new Array<ServiceItemOption>()

        const init = ()=>{
           
            serviceItems.value = JSON.parse(JSON.stringify(initRow)) as 
            Array<ServiceItemOption>
        }
        const member = ref<MemberView>()

        onMounted(async ()=>{
             initRow = (await api.serviceItemAPI.all())
                .map(((e)=>{
                    return {
                        label:e.name,
                        count:0,
                        value:{serviceItemId:e._id,shortName:e.shortName}
                    }
                }))

              init()
        })

        const dialog = ref<QDialog>()
        const form = ref<QForm>()
        const $q = useQuasar()

        const submitting = ref(false)
        return {
            member,
            form,
            show: async ()=>{
                member.value = await api.memberAPI.get(props.memberId)
                init()
            },
            submit:async ()=>{
                if(serviceItems.value!=undefined &&
                    !(submitting.value))
                {
                    submitting.value = true
                 

                    const selectedItems = (serviceItems.value.filter(p=>p.count>0))
                    const result = await api.memberAPI.gift(props.memberId,
                    selectedItems.map((p)=>{
                        return {
                            serviceItemId:p.value.serviceItemId,
                            count:p.count
                        }
                    }))
                    
                    submitting.value = false
                    if(result)
                    {
                        dialog.value?.hide()
                        context.emit.call(null,'finished')

                        $q.notify({
                            message:'操作成功',
                            type:'positive',
                            position:'center',
                            timeout:1000
                        })
                    }
                    else
                    {
                        dialog.value?.shake()
                        $q.notify({
                            message:'操作失败',
                            type:'negative',
                            position:'center',
                            timeout:2000
                        })
                    }
                }
            },
            submitting,
            dialog,
            serviceItems
        }
    }
})
</script>

<style>
</style>