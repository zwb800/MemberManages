<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="color" elevated>
      <div class="row">
      <q-toolbar class="col q-pr-none">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>
        <q-separator dark vertical inset />
          <q-btn stretch flat icon="add" @click="newmember = true">开卡</q-btn>
          <q-separator dark vertical inset />
      </q-toolbar>
      <q-toolbar class="col-3">
         <q-input dark dense standout v-model="text" placeholder="姓名/手机号" input-class="text-right">
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
          </template>
        </q-input>
      </q-toolbar>
      </div>
       
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
   <new-member v-model="newmember" @added="search"></new-member>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter,useRoute } from 'vue-router'


const linksList = [
  {
    title: '会员',
    caption: '会员列表',
    icon: 'school',
    link: '/',
    color:'bg-primary',
  },
  {
    title: '工作量',
    caption: '工作量统计',
    icon: 'code',
    link: '/work',
    color:'bg-teal',
  },
  
];

import { defineComponent, ref,watch,onMounted } from 'vue'
import NewMember from '../components/NewMember.vue'
export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,NewMember
  },

  setup () {
    const router = useRouter()
    const route = useRoute()
    const leftDrawerOpen = ref(false)
    const text = ref('')

    const search = async()=>{
      await router.replace({name:'memberlist',
      params:{search:text.value}})
    }

    watch(text,search)
    const title = ref('')
    const color = ref('')
    const getTitle = ()=>{
      console.log(route.path)
      const link = linksList.find(l=>l.link==route.path)
      if(link)
      {
        title.value = link.title
        color.value = link.color
      }
        
      else
          title.value = ''

    }
    onMounted(getTitle)
    watch(route,getTitle)

    return {
      text,
      search,
      title,
      color,
      essentialLinks: linksList,
      newmember:ref(false),
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
