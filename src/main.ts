import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Ripple, ClosePopup } from 'quasar'
import 'quasar/dist/quasar.css'
import { i18n } from './i18n'

createApp(App)
  .use(Quasar, {
    directives: {
      Ripple,
      ClosePopup
    }
  })
  .use(i18n)
  .mount('#app')