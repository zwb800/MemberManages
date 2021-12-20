<template>
  <q-page padding>
    <member-list :search="search"></member-list>
    <q-page-scroller position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_up" />
    </q-page-scroller>
  </q-page>
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
            
            }
  }
});
</script>
