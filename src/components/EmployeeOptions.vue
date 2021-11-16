<template>
   <p class="q-mb-none">头疗师</p>
            <q-btn-toggle
                    toggle-color="info"
                    v-model="employee" :options="[
                    {label:'店内平分',value:7},
                        {label:'张文彬',value:1},
                        {label:'王雅芳',value:2},
                        {label:'侯悦',value:3},
                        {label:'艾鹏飞',value:4},
                        {label:'程旭东',value:5},
                        {label:'柳长兰',value:6},
                    ]"></q-btn-toggle>
</template>

<script>
export default {
    data(){
        return {
            employee:0
        }
    }
}
</script>

<style>

</style>