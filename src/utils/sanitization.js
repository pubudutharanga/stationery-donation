import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  if (!input) return '';
  
  let sanitized = input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/[\\'`"\\]/g, '')
    .trim();
    
  if (typeof DOMPurify !== 'undefined') {
    sanitized = DOMPurify.sanitize(sanitized);
  }
  
  return sanitized;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const sriLankanRegex = /^(?:\+94|0)?(?:7[0-9]|11|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|8[0-9]|9[0-9])[0-9]{7}$/;
  return sriLankanRegex.test(phone.replace(/\s/g, ''));
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};