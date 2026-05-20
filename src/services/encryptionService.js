import nacl from 'tweetnacl';
import * as naclUtils from 'tweetnacl-util';

class EncryptionService {
  constructor() {
    // Llave de encriptación fija (en producción, usar variable de entorno)
    this.key = nacl.hash(naclUtils.decodeUTF8('joelbazar-secret-key'));
  }

  // Encriptar texto
  encrypt(plaintext) {
    try {
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      const plainBytes = naclUtils.decodeUTF8(plaintext);
      const encrypted = nacl.secretbox(plainBytes, nonce, this.key);

      // Combinar nonce + encrypted en base64
      const full = new Uint8Array(nonce.length + encrypted.length);
      full.set(nonce);
      full.set(encrypted, nonce.length);

      return naclUtils.encodeBase64(full);
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Error encriptando datos');
    }
  }

  // Desencriptar texto
  decrypt(ciphertext) {
    try {
      const full = naclUtils.decodeBase64(ciphertext);
      const nonce = full.slice(0, nacl.secretbox.nonceLength);
      const encrypted = full.slice(nacl.secretbox.nonceLength);

      const plainBytes = nacl.secretbox.open(encrypted, nonce, this.key);
      if (!plainBytes) {
        throw new Error('Decryption failed');
      }

      return naclUtils.encodeUTF8(plainBytes);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Error desencriptando datos');
    }
  }

  // Encriptar Airtable token
  encryptToken(token) {
    return this.encrypt(token);
  }

  // Desencriptar Airtable token
  decryptToken(encryptedToken) {
    return this.decrypt(encryptedToken);
  }
}

export const encryptionService = new EncryptionService();
