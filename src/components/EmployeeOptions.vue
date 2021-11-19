<template>
    <p class="q-mb-none">头疗师</p>
    <q-btn-group>
        <template :key="row.value" v-for="row in rows">
            <q-btn @click="row.selected = false" color="primary" v-if='row.selected' :label='row.label'></q-btn>
            <q-btn @click="row.selected = true" v-else :label='row.label'></q-btn>
        </template>
    </q-btn-group>
</template>

<script>
export default {
    data(){
        return {
            employee:0,
            rows:[
                    {label:'店内平分',value:7},
                        {label:'张文彬',value:1},
                        {label:'王雅芳',value:2},
                        {label:'侯悦',value:3},
                        {label:'艾鹏飞',value:4},
                        {label:'程旭东',value:5},
                        {label:'柳长兰',value:6},
                ]
        }
    }
}
</script>

<style>

</style>