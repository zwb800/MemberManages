<template>
<q-dialog persistent>
    <q-card style="min-width:600px">
        <q-bar class="bg-secondary text-white">
          <div>充值</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>

        <q-card-section class="q-pt-none">
<member-info-bar></member-info-bar>
  <charge-form></charge-form>
  </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
            <q-btn label="保存" type="submit" color="primary"></q-btn>
              <q-btn label="重置" type="reset"></q-btn>
        </q-card-actions>
    </q-card>
</q-dialog>
</template>

<script lang='ts'>
import ChargeForm from './ChargeForm.vue'
import MemberInfoBar from './MemberInfoBar.vue'
import {defineComponent} from 'vue'
export default defineComponent({
    components:{ ChargeForm, MemberInfoBar},

})
</script>

<style>

</style>