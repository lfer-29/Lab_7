const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

const data = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
const privateKey = fs.readFileSync('private.pem', 'utf8');

function decryptPriv(encryptedB64, privateKey){
    const decryptedBuffer = crypto.privateDecrypt({
        key: privateKey,
        padding: ASYM_PAD,
        oaepHash: 'sha256',
    
    }, Buffer.from(encryptedB64,'base64'));
    return decryptedBuffer;
}

const aesKey = decryptPriv(data.key, privateKey);
const iv = decryptPriv(data.iv, privateKey);

function decrypt(text, key, iv) {
  let encryptedText = Buffer.from(text, 'base64');
  let decipher = crypto.createDecipheriv(SYM_ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const decryptedMessages = data.data.map(msg => decrypt(msg, aesKey, iv));

console.log('Decrypted Messages:');
decryptedMessages.forEach(msg => console.log(msg));