<template>
  <q-layout view="hhh lpr lFf">
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
      overlay
      :width="200"
      behavior="desktop"

      elevated
    >
    
      <q-list>
        <!-- <q-item-label
          header
        >
          菜单
        </q-item-label> -->
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
   <new-member v-model="newmember" @finished="refersh"></new-member>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter,useRoute } from 'vue-router'


const linksList = [
  {
    title: '会员',
    caption: '会员列表',
    icon: 'school',
    link: '/member',
    color:'#1976d2',
    bgColor:'bg-primary'
  },
  {
    title: '工作量',
    caption: '工作量统计',
    icon: 'code',
    link: '/work',
    color:'#26a69a',
    bgColor:'bg-secondary',
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
    const miniState = ref(true)
    const text = ref('')

    const search = async(s=text.value)=>{
      const result = await router.replace({name:'memberlist',
      params:{search:s}})
      console.log(result)
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
        color.value = link.bgColor
        const themeColors = document.getElementsByName('theme-color')
        if(themeColors.length>0)
          themeColors[0].setAttribute('content',link.color)
      }
        
      else
          title.value = ''

    }
    onMounted(getTitle)
    watch(route,getTitle)

    return {
      text,
      search,
      miniState,
      async refersh(){
        await search(' ')
        await search('')
      },
      title,
      color,
      essentialLinks: linksList,
      newmember:ref(false),
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      toggleMiniState(){
        miniState.value = !miniState.value
      }
    }
  }
})
</script>
