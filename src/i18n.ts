import { createI18n } from 'vue-i18n'
import de from './locales/de.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import tr from './locales/tr.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    de,
    en,
    fr,
    tr
  }
})