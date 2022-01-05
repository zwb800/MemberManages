import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN from 'vite-plugin-cdn-import'
import externalGlobals from "rollup-plugin-external-globals"

// https://vitejs.dev/config/
export default defineConfig({
  // root:'src',
  // build:{
  //   minify:false,
  //   rollupOptions:{
      // external:['quasar'],
      // plugins:[externalGlobals({quasar:'Quasar'})]
  //   }
  // },
  plugins: [vue(),
  importToCDN({
    modules:[
      {
          name: 'vue',
          var: 'Vue',
          path: 'https://unpkg.com/vue@3.2.26/dist/vue.runtime.global.prod.js',
      },
      // {
      //   var: 'quasar',
      //   name: 'quasar',
      //   path: 'https://unpkg.com/quasar@2.4.2/dist/quasar.umd.prod.js',
      // },
    ]
  })
]
})
