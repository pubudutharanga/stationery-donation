import { translations } from './translations';

export const LANGUAGES = {
  EN: 'en',
  SI: 'si',
  TA: 'ta'
};

export const LANGUAGE_NAMES = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்'
};

export const getTranslation = (key, lang = 'en', variables = {}) => {
  const langTranslations = translations[lang] || translations.en;
  let text = langTranslations[key] || translations.en[key] || key;
  
  // Replace variables like {{year}}
  Object.keys(variables).forEach(varKey => {
    const regex = new RegExp(`{{${varKey}}}`, 'g');
    text = text.replace(regex, variables[varKey]);
  });
  
  return text;
};