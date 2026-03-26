const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

const aesKey = crypto.randomBytes(16); 
const iv = crypto.randomBytes(16);

const publicKey = fs.readFileSync('public.pem', 'utf8');

function encrypt(text,key,iv) {
    let cipher = crypto.createCipheriv(SYM_ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64')
}
let phrases =[
    'YAY!',
    'Hi world!'
]

let encryptedMessages = phrases.map(p => encrypt(p, aesKey, iv));


function encryptPub(txt,publicKey) {
    const encryptedBuffer = crypto.publicEncrypt({
        key: publicKey,
        padding: ASYM_PAD,
        oaepHash: 'sha256',
    }, Buffer.from(txt));
    return encryptedBuffer.toString('base64');
}

const encryptedKey = encryptPub(aesKey, publicKey);
const encryptedIV = encryptPub(iv, publicKey);

const output = {
  key: encryptedKey,
  iv: encryptedIV,
  data: encryptedMessages
};

fs.writeFileSync('messages.json', JSON.stringify(output, null, 2));