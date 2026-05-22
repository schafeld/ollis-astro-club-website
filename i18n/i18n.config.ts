import de from '../messages/de.json';
import en from '../messages/en.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'de',
  messages: {
    de,
    en,
  },
}));