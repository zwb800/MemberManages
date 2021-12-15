<template>
  <q-page class="row justify-evenly">
    <member-list :search="search"></member-list>
  </q-page>
   <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" @click="newmember = true" />
          </q-page-sticky>
          <new-member v-model="newmember" @added="getMembers"></new-member>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue';
import MemberList from '../components/MemberList.vue';
import NewMember from '../components/NewMember.vue'

export default defineComponent({
  name: 'PageIndex',
  components: {MemberList,NewMember },
   props:{search:{type:String}},
  setup() {

    return { 
      getMembers:()=>{
        console.log('刷新列表')
      },
            newmember:ref(false),
            }
  }
});
</script>
