import { generateKeyPairSync } from 'node:crypto';
import { Crypt } from './crypt';

describe('Crypt', () =>
{
    let recipientPublicKey: string;
    let recipientPrivateKey: string;
    let otherPublicKey: string;

    beforeAll(() =>
    {
        const recipientKeys = generateKeyPairSync('rsa',
        {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });

        const otherKeys = generateKeyPairSync('rsa',
        {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });

        recipientPublicKey = recipientKeys.publicKey;
        recipientPrivateKey = recipientKeys.privateKey;
        otherPublicKey = otherKeys.publicKey;
    });

    describe('encrypt / decrypt', () =>
    {
        test('performs hybrid encryption round-trip', () =>
        {
            const plaintext = 'Sensitive payload';
            const payload = Crypt.encrypt(plaintext, recipientPublicKey);

            const payloadParts = payload.split(':');

            expect(payloadParts).toHaveLength(4);
            payloadParts.forEach(part => expect(part).toMatch(/^[A-Za-z0-9+/=]+$/));

            const decrypted = Crypt.decrypt(payload, recipientPrivateKey);
            expect(decrypted).toBe(plaintext);
        });

        test('fails to decrypt when payload is tampered', () =>
        {
            const payload = Crypt.encrypt('Integrity matters', recipientPublicKey);
            const payloadParts = payload.split(':');
            payloadParts[3] = Buffer.from('tampered', 'utf8').toString('base64');

            expect(() => Crypt.decrypt(payloadParts.join(':'), recipientPrivateKey)).toThrow();
        });
    });

    describe('sign / verifySignature', () =>
    {
        test('verifies a valid signature', () =>
        {
            const message = 'Message integrity check';

            const signature = Crypt.sign(message, recipientPrivateKey);
            expect(signature).toMatch(/^[A-Za-z0-9+/=]+$/);

            expect(Crypt.verifySignature(message, signature, recipientPublicKey)).toBe(true);
        });

        test('rejects a signature if message changes', () =>
        {
            const message = 'Authenticity is key';
            const signature = Crypt.sign(message, recipientPrivateKey);

            expect(Crypt.verifySignature('Altered message', signature, recipientPublicKey)).toBe(false);
        });

        test('rejects signatures produced by a different key pair', () =>
        {
            const message = 'Check signer identity';
            const signature = Crypt.sign(message, recipientPrivateKey);

            expect(Crypt.verifySignature(message, signature, otherPublicKey)).toBe(false);
        });
    });
});
