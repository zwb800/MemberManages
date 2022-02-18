<template>
<q-page padding>
    <div class="row">
<q-file standout
    accept=".xls,.xlsx"
      v-model="file"
      label="导入"
    />
    </div>

</q-page>
    
</template>
<script lang="ts">
import { api, Member } from '../components/models'
import { defineComponent, ref, watch } from 'vue'

import { read } from 'xlsx'

export default defineComponent({
    setup() {
        const file = ref()

        watch(file,async ()=>{
            const data = await file.value.arrayBuffer()

            const workbook = read(data)

            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            
            let row=3
            const cellV = (col:string)=>{
                const r = worksheet[col+row]
                if(r)
                    return r.v
                else
                    r
            }

            const arrMembers = new Array<Member>()
            for(;row<10000;row++)
            {

                const no = cellV('A')
                if(!no)
                    break

                const member = {
                    _id:'',
                    no:parseInt(no),
                    name:cellV('C'),
                    phone:cellV('D'),
                    balance:parseInt(cellV('J')),
                    consume:parseInt(cellV('L')),
                    newCardTime: (cellV('T')),
                    head:0,
                }

                const strCount = cellV('X')
                if(strCount){
                    member['head'] = parseInt(strCount)
                }

                arrMembers.push(member)
            }

            api.memberAPI.import(arrMembers)
        })

        return {
            file
        }
    },
})
</script>
