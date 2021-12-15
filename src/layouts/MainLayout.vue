<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          会员
        </q-toolbar-title>

          <q-input dark dense standout v-model="text" placeholder="姓名/手机号" class="col-3" input-class="text-right">
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
          </template>
        </q-input>
        <!-- <q-btn flat round dense icon="search" /> -->
      </q-toolbar>
       
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          菜单
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'


const linksList = [
  {
    title: '会员',
    caption: '会员列表',
    icon: 'school',
    link: '/'
  },
  {
    title: '工作量',
    caption: '工作量统计',
    icon: 'code',
    link: 'work'
  },
  
];

import { defineComponent, ref,watch } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const text = ref('')
    watch(text,async ()=>{
      await router.replace({name:'memberlist',params:{search:text.value}})
    })

    return {
      text,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
