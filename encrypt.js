const CryptoJS = require("crypto-js");
const readline = require("readline");

const keySize = 256;
const iterations = 100;

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

r1.question("Enter Your Private Key: (Windows right click to paste)", function (
  privateKey
) {
  r1.question("Enter Your RegenBot Password:", function (password) {
    try {
      run(privateKey, password);
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });
});

async function run(privateKey, password) {
  var prefixedKey = "0x" + privateKey;
  var encrypted = encrypt(prefixedKey, password);
  var decrypted = decrypt(encrypted, password);

  console.log(
    `Copy the entire Encrypted Message and paste into your .env file`
  );
  console.log(`Encrypted Message: ${encrypted}`);
  console.log(
    `Verify the Decrypted Key matches your Private Key with 0x Prefix`
  );
  console.log(`Decrypted Key: ${decrypted}`);
  process.exit();
}

function encrypt(msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  var iv = CryptoJS.lib.WordArray.random(128 / 8);

  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

function decrypt(transitmessage, pass) {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var encrypted = transitmessage.substring(64);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
