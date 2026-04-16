import CryptoJS from "crypto-js";

// Hashing: One-way (cannot be undone)
export const generateSHA1 = (message: string): string => {
  return CryptoJS.SHA1(message).toString();
};

// Encryption: Two-way (requires a key to lock and unlock)
export const encryptDES = (text: string, key: string): string => {
  return CryptoJS.DES.encrypt(text, key).toString();
};

export const decryptDES = (ciphertext: string, key: string): string => {
  const bytes = CryptoJS.DES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateRandomKey = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};