import { createI18n } from 'vue-i18n'
import ar from './locales/ar.json'
import de from './locales/de.json'
import en from './locales/en.json'
import tr from './locales/tr.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    ar,
    de,
    en,
    tr
  }
})