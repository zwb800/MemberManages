import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {path:'/',redirect:'/work'},
      { path: '/member', name:'memberlist', 
      component: () => import('../pages/MemberList.vue'),props:true },
      { path: '/work', component: () => import('../pages/Work.vue') },
      { path:'/consume',component:()=>import('../pages/ConsumeList.vue')},
      { path:'/charge',component:()=>import('../pages/Charge.vue')},
      { path:'/stock',component:()=>import('../pages/Stock.vue')},
      { path:'/settings',component:()=>import('../pages/Settings.vue')},
      { path:'/help',component:()=>import('../pages/Help.vue')}
  ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404.vue'),
  },
];

export default routes;
