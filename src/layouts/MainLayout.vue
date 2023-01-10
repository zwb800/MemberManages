<template>
  <q-ajax-bar size="1px" color="white" />
  <q-layout view="hHh Lpr fFf">
    <q-header :class="'bg-' + color" reveal elevated>
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
            {{ title }}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar class="col-auto">
          <q-btn stretch flat icon="add" @click="newmember = true">开卡</q-btn>
          <q-input
            debounce="500"
            style="width: 150px"
            dark
            dense
            standout
            v-model="text"
            placeholder="姓名/手机号"
            input-class="text-right"
          >
            <template v-slot:append>
              <q-icon v-if="text === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="text = ''"
              />
            </template>
          </q-input>
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      :width="180"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
          <q-item clickable @click="shopSwitch">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ shopId==1?'荣庆':'新东方' }}店</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal v-if="footer && footer.length > 0">
      <q-bar class="justify-center text-caption" :class="'bg-' + color">
        <!-- <span>总 {{ footer.sum}}</span>
        <q-separator vertical dark inset class="q-ml-sm q-mr-sm"></q-separator>
        <span>新 {{footer.new}}</span>
        <template :key="f" v-for="f of footer.items">
          <q-separator vertical dark inset class="q-ml-sm q-mr-sm"></q-separator>
          <span>{{f.label}} {{f.count}}</span>
        </template>
        <q-separator vertical dark inset class="q-ml-sm q-mr-sm"></q-separator>
        <span>办卡 0</span>
        <q-separator vertical dark inset class="q-ml-sm q-mr-sm"></q-separator>
        <span>销售额 {{footer.sale}}</span>  -->
        <template :key="r" v-for="(r, i) of footer">
          <span>{{ timeStr(r.time) }} {{ r.num }}位</span>
          <q-separator
            v-if="i != footer.length - 1"
            vertical
            dark
            inset
            class="q-ml-sm q-mr-sm"
          ></q-separator>
        </template>
      </q-bar>
    </q-footer>
  </q-layout>
  <new-member v-model="newmember" @finished="refersh"></new-member>
</template>

<script lang="ts">
import EssentialLink from '../components/EssentialLink.vue';
import { useRouter, useRoute } from 'vue-router';
import { timeStr } from '../components/utils';

const linksList = [
  {
    title: '工作量',
    caption: '工作量统计',
    icon: 'pending_actions',
    link: '/work',
    color: 'secondary',
    separator: false,
  },
  {
    title: '预约',
    caption: '预约',
    icon: 'schedule',
    link: '/reservation',
    color: 'primary',
    separator: false,
  },
  {
    title: '会员',
    caption: '会员列表',
    icon: 'supervisor_account',
    link: '/member',
    color: 'primary',
    separator: false,
  },
  {
    title: '消费',
    caption: '消费',
    icon: 'credit_card',
    link: '/consume',
    color: 'primary',
    separator: false,
  },
  {
    title: '充值',
    caption: '充值',
    icon: 'paid',
    link: '/charge',
    color: 'primary',
    separator: false,
  },
  {
    title: '库存',
    caption: '库存',
    icon: 'upgrade',
    link: '/stock',
    color: 'primary',
    separator: false,
  },
  // {
  //   title: '统计',
  //   caption: '统计',
  //   icon: 'data_exploration',
  //   link: '/statistics',
  //   color:'primary',
  //   separator:true,
  // },
  {
    title: '设置',
    caption: '设置',
    icon: 'settings',
    link: '/settings',
    color: 'secondary',
    separator: false,
  },
  {
    title: '帮助',
    caption: '帮助',
    icon: 'help',
    link: '/help',
    color: 'secondary',
    separator: false,
  },
];

import { defineComponent, ref, watch, onMounted } from 'vue';
import NewMember from '../components/NewMember.vue';
import { getCssVar } from 'quasar';
import { api, FooterView } from '../components/models';
import { Reservation } from 'src/components/reservationApi';
import axios from 'axios';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    NewMember,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const leftDrawerOpen = ref(false);
    const miniState = ref(true);
    const text = ref('');

    const search = async (s = text.value) => {
      const result = await router.replace({
        name: 'memberlist',
        params: { search: s },
      });
    };

    watch(text, search);
    const title = ref('');
    const color = ref('');
    const getTitle = () => {
      const link = linksList.find((l) => l.link == route.path);
      if (link) {
        title.value = link.title;
        color.value = link.color;
        const themeColors = document.getElementsByName('theme-color');
        const setColor = getCssVar(link.color);
        if (themeColors.length > 0 && setColor) {
          themeColors[0].setAttribute('content', setColor);
        }
      } else title.value = '';
    };

    const footer = ref<Reservation[]>();
    const loadResv = async () => {
      footer.value = await api.reservation.all();
      setTimeout(() => {
        loadResv()
          .then(() => {
            return;
          })
          .finally(() => {
            return;
          });
      }, 5 * 60 * 1000);
    };
    onMounted(async () => {
      getTitle();

      let url = 'ws://' + location.hostname + ':9000';
      if (window.hasOwnProperty('env'))
        url = (eval(`window.env.API_URL`) as string).replace('http', 'ws');
      // const socket = io(url)
      // socket.on('newReservation',(args)=>{
      //   console.log(args)
      // })
      // const today = new Date()
      // const todayStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
      // const startDate = todayStr
      // const endDate = todayStr+' 23:59:59'

      // footer.value = await api.employeeAPI.footer(new Date(startDate),new Date(endDate))
      await loadResv();
    });
    watch(route, getTitle);
    const sId = localStorage.getItem('shopId');
    const shopId = ref(sId ? parseInt(sId) : 0);
    axios.defaults.headers.common['shopId'] = shopId.value.toString();

    const shopSwitch = async () => {
      shopId.value = shopId.value == 1 ? 2 : 1;
      localStorage.setItem('shopId', shopId.value.toString());
      // if (route.path == '/work') {
      //   await router.replace('help');
      // }
      // await router.replace('work');
      location.reload();
    };

    return {
      shopId,
      footer,
      text,
      timeStr,
      search,
      miniState,
      async refersh() {
        await search(' ');
        await search('');
      },
      shopSwitch,
      title,
      color,
      essentialLinks: linksList,
      newmember: ref(false),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      toggleMiniState() {
        miniState.value = !miniState.value;
      },
    };
  },
});
</script>
