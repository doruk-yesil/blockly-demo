import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'
import { i18n } from './i18n'


createApp(App).use(Quasar).use(i18n).mount('#app')
