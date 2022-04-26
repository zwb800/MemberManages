<template>
    <q-dialog @show="show">
        <q-card>
            <q-card-section>
            <q-input input-class="q-mt-none"  style="width:300px" autogrow v-model="text" type="textarea" />
        </q-card-section>
        </q-card>
        
    </q-dialog>
</template>
<script lang="ts">
import { defineComponent,ref } from 'vue'
import { FooterView, WorkView } from './models'

export default defineComponent({
    props:{'data':{required:false},'work':{required:false}},
    setup(props) {
        const date = new Date()
        
        const text = ref('')

       
        return {
            text,
            show:()=>{
                const d = props.data as FooterView

                const w = props.work as WorkView[]

                const count = (label:string)=>{
                    let c = d.items.find(p=>p.label == label)?.count
                    return emptyStr(c)
                }

                const count78 = ()=>{
                    let count = 0
                   for (const item of w) {
                        for (const c of item.consumers) {
                            if(c.items.length == 2 && c.items[0] == '头' && 
                            (c.items[1] == '眼'||c.items[1] == '面')){
                                count ++
                            }
                        }
                   }
                   return count
                }



                const emptyStr = (n:number|undefined)=>{
                    return n!=null&&n>0?n?.toString():''
                }

                const sumPrice = (arrCard:Array<number>)=>{
                    const arr = d.cards.filter(f=>arrCard.includes(f))
                    if(arr.length>0)
                        return arr.reduce((t,n)=>t+n).toString()
                    return ''
                }

                let shopId = localStorage.getItem('shopId')
                if(shopId == null)
                    shopId = '1'
                text.value =  `头部码头 张家口${shopId}店 ${date.getMonth()+1}月${date.getDate()}日
进店总人数:${emptyStr(d.sum)}
新顾客人数:${emptyStr(d.new)}
48元服务人数:${count('头')}
78元服务人数:${emptyStr(count78())}
220元服务人数:
88元体验服务人数:
面膜服务人数:${count('面')}
发疗服务人数:${count('发')}
眼疗服务人数:${count('眼')}
冰疗服务人数:${count('冰')}
姜疗服务人数:${count('姜')}
眼护服务人数:${count('眼护')}
面护服务人数:${count('面护')}
姜疗划卡业绩:
姜疗现金业绩:
冰疗划卡业绩:
冰疗现金业绩:
发疗服务人数:
发疗划卡业绩:
发疗现金业绩:
头皮养护划卡业绩:
头皮养护现金业绩:
储值卡开卡数量 :${emptyStr(d.cards.filter(f=>[300,500,1000].includes(f)).length)}
储值卡办卡业绩:${sumPrice([300,500,1000])}
储值卡续卡数量 :
储值卡续卡业绩:
48元健康卡数量:${emptyStr(d.cards.filter(f=>f == 1288).length)}
48元健康卡业绩 :${sumPrice([1288])}
78元健康卡数量:
78元健康卡业绩 :
年卡业绩:
其他业绩:${emptyStr(d.otherPrice)}
总业绩 : ${emptyStr(d.otherPrice+d.cardPrice)}
销售额 :${emptyStr(d.sale)}
当日考勤 应到:6人
                实到:6人`
            },
        }
    },
})
</script>
