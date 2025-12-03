import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'donation-form-secure-key-2024';

export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (encrypted) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const hashData = (data) => {
  try {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  } catch (error) {
    console.error('Hashing error:', error);
    return null;
  }
};