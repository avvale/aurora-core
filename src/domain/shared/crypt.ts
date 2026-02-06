import { hashSync } from 'bcrypt';
import {
  constants,
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  createSign,
  createVerify,
  privateDecrypt,
  publicEncrypt,
  randomBytes,
} from 'node:crypto';
import { readFileSync } from 'node:fs';

export class Crypt {
  // Confidentiality: encrypt with public key (hybrid AES-GCM + RSA-OAEP)
  static encrypt(plaintext: string, recipientPublicPem: string): string {
    // 1) AES session key and nonce
    const aesKey = randomBytes(32); // AES-256
    const iv = randomBytes(12); // Recommended 96-bit nonce for GCM

    // 2) encrypt data with AES-GCM
    const cipher = createCipheriv('aes-256-gcm', aesKey, iv);
    const cipherText = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // 3) wrap the AES key with RSA-OAEP (SHA-256)
    const wrappedKey = publicEncrypt(
      {
        key: recipientPublicPem,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      aesKey,
    );

    // We concatenate everything into a single base64url string (cleaner than normal base64).
    const parts = [
      wrappedKey.toString('base64'),
      iv.toString('base64'),
      authTag.toString('base64'),
      cipherText.toString('base64'),
    ];

    return parts.join(':'); // 🔸 format: wrappedKey:iv:authTag:cipherText
  }

  static encryptWithAuroraPublicKey(plaintext: string): string {
    const publicKey = readFileSync(process.env.OAUTH_PUBLIC_KEY_PATH, 'utf8');
    return Crypt.encrypt(plaintext, publicKey);
  }

  // Confidentiality: decrypt with private key
  static decrypt(payload: string, recipientPrivatePem: string): string {
    const [wrappedKey, iv, authTag, cipherText] = payload.split(':');

    const aesKey = privateDecrypt(
      {
        key: recipientPrivatePem,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(wrappedKey, 'base64'),
    );

    const decipher = createDecipheriv(
      'aes-256-gcm',
      aesKey,
      Buffer.from(iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(cipherText, 'base64')),
      decipher.final(),
    ]);

    return plaintext.toString('utf8');
  }

  static decryptWithAuroraPrivateKey(payload: string): string {
    if (typeof payload !== 'string') return null;

    const privateKey = readFileSync(process.env.OAUTH_PRIVATE_KEY_PATH, 'utf8');
    return Crypt.decrypt(payload, privateKey);
  }

  // Authenticity: sign with private key (RSASSA-PSS SHA-256)
  static sign(message: string, senderPrivatePem: string): string {
    const sign = createSign('sha256');
    sign.update(message);
    sign.end();

    const signature = sign.sign({
      key: senderPrivatePem,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    });

    return signature.toString('base64');
  }

  // Verification: with public
  static verifySignature(
    message: string,
    signatureB64: string,
    senderPublicPem: string,
  ): boolean {
    const verify = createVerify('sha256');
    verify.update(message);
    verify.end();

    return verify.verify(
      {
        key: senderPublicPem,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32,
      },
      Buffer.from(signatureB64, 'base64'),
    );
  }

  static sha1(data: string): string {
    const generator = createHash('sha1');
    generator.update(data);

    return generator.digest('hex');
  }

  static hash(password: string, saltRounds = 10): string {
    return hashSync(password, saltRounds);
  }

  static signature(secret: string, payload: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }
}
