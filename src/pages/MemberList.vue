<template>
  <q-page class="row justify-evenly">
    <member-list :search="search"></member-list>
  </q-page>
   <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" @click="newmember = true" />
          </q-page-sticky> -->
         
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MemberList from '../components/MemberList.vue';


export default defineComponent({
  name: 'PageIndex',
  components: {MemberList },
   props:{search:{type:String}},
  setup() {

    return { 
      getMembers:()=>{
        console.log('刷新列表')
      },
            
            }
  }
});
</script>
