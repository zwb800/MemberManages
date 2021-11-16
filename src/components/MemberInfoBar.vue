<template>
  <div class="row q-gutter-md q-mt-none">
      <q-field class="col q-mt-none" label="姓名" stack-label borderless>
          <template v-slot:control>
              张三
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="手机号" stack-label borderless>
          <template v-slot:control>
              13387651234
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="开卡时间" stack-label borderless>
          <template v-slot:control>
              2021-9-10 15:45
          </template>
      </q-field>
  </div>
  <div class="row q-gutter-md q-mt-none">
      <q-field class="col q-mt-none" label="余额" stack-label borderless>
          <template v-slot:control>
              ￥300
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="头疗" stack-label borderless>
          <template v-slot:control>
              10
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="姜疗" stack-label borderless>
          <template v-slot:control>
              10
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="冰疗" stack-label borderless>
          <template v-slot:control>
              0
          </template>
      </q-field>
      <q-field class="col q-mt-none" label="发疗" stack-label borderless>
          <template v-slot:control>
              0
          </template>
      </q-field>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>