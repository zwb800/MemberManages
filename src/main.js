import { createApp } from 'vue'
import { Quasar,Notify } from 'quasar'
import quasarLang from 'quasar/lang/zh-CN'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './router/routes'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

const myApp = createApp(App)
myApp.use(router)
myApp.use(Quasar, {
  plugins: {Notify}, // import Quasar plugins and add here
  lang: quasarLang,
  
  config: {
    // brand: {
    //   // primary: '#e46262',
    //   // ... or all other brand colors
    // },
    notify: {
      type:'positive',
      position:'center',
      timeout:1000
    }, // default set of options for Notify Quasar plugin
    // loading: {...}, // default set of options for Loading Quasar plugin
    // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
  
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')

// if('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// };