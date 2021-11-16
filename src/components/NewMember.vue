<template>
      <q-form class="q-gutter-md q-pb-md">
          <div class="row q-mt-none">
            <q-input class="col" label="姓名" v-model="name"></q-input>
            <q-input class="col q-ml-md" label="手机号" v-model="phone"></q-input>
          </div>
      </q-form>
      <charge-form></charge-form>
</template>

<script>
import ChargeForm from './ChargeForm.vue'
export default {
    components:{ ChargeForm},
    data(){
        return {
            name:'',
            phone:'',
           
            
        }
    }
}
</script>

<style>

</style>