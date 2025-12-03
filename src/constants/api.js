// src/constants/api.js
export const CONFIG = {
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER,
  ADMIN_EMAIL: import.meta.env.VITE_ADMIN_EMAIL,
  MAX_ITEMS: 100,
  MAX_NOTES_LENGTH: 500,
  SUPPORTED_LANGUAGES: ['en', 'si', 'ta']
};

export const DONATION_TYPES = {
  NOTEBOOKS: 'notebooks',
  PENS: 'pens',
  BACKPACKS: 'backpacks',
  CRAYONS: 'crayons',
  OTHER: 'other'
};

export const URGENCY_LEVELS = {
  NORMAL: 'normal',
  URGENT: 'urgent'
};

export const PICKUP_PREFERENCES = {
  FLEXIBLE: 'flexible',
  ASAP: 'asap',
  WEEKEND: 'weekend',
  EVENING: 'evening'
};