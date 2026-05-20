import nacl from 'tweetnacl';
import * as naclUtils from 'tweetnacl-util';

class EncryptionService {
  constructor() {
    this.key = nacl.hash(naclUtils.decodeUTF8('joelbazar-secret-key'));
  }

  encrypt(plaintext) {
    try {
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      const plainBytes = naclUtils.decodeUTF8(plaintext);
      const encrypted = nacl.secretbox(plainBytes, nonce, this.key);

      const full = new Uint8Array(nonce.length + encrypted.length);
      full.set(nonce);
      full.set(encrypted, nonce.length);

      return naclUtils.encodeBase64(full);
    } catch (error) {
      throw new Error('Error encriptando datos');
    }
  }

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
      throw new Error('Error desencriptando datos');
    }
  }

  encryptToken(token) {
    return this.encrypt(token);
  }

  decryptToken(encryptedToken) {
    return this.decrypt(encryptedToken);
  }
}

export const encryptionService = new EncryptionService();
