function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function primefiller() {
  const seive = Array(250).fill(true);
  seive[0] = false;
  seive[1] = false;

  for (let i = 2; i < 250; i++) {
      for (let j = i * 2; j < 250; j += i) {
          seive[j] = false;
      }
  }

  for (let i = 0; i < seive.length; i++) {
      if (seive[i]) {
          prime.add(i);
      }
  }
}

function pickrandomprime() {
  const k = Math.floor(Math.random() * prime.size);
  const it = prime.values();
  for (let i = 0; i < k; i++) {
      it.next();
  }

  const ret = it.next().value;
  prime.delete(ret);
  return ret;
}

function setkeys() {
  let keys = {};
  prime1 = pickrandomprime();
  prime2 = pickrandomprime();

  n = prime1 * prime2;
  keys.n = n;
  fi = (prime1 - 1) * (prime2 - 1);

  e = 2;
  while (true) {
      if (gcd(e, fi) === 1) {
          break;
      }
      e += 1;
  }

  public_key = e;
  keys.public_key = e;

  d = 2;
  while (true) {
      if ((d * e) % fi === 1) {
          break;
      }
      d += 1;
  }

  private_key = d;
  keys.private_key = d;

  return keys;
}

function encrypt(message, public_key_, n_) {
  let e = public_key_;
  let encrypted_text = 1;
  while (e > 0) {
      encrypted_text *= message;
      encrypted_text %= n_;
      e -= 1;
  }
  return encrypted_text;
}

function decrypt(encrypted_text, n_, private_key_) {
  let d = private_key_;
  let decrypted = 1;
  while (d > 0) {
      decrypted *= encrypted_text;
      decrypted %= n_;
      d -= 1;
  }
  return decrypted;
}

function encoder(message, public_key_, n_) {
  const encoded = [];
  for (const letter of message) {
      encoded.push(encrypt(letter.charCodeAt(0), public_key_, n_));
  }
  return encoded;
}

function decoder(encoded, n_, private_key_) {
  let s = '';
  for (const num of encoded) {
      s += String.fromCharCode(decrypt(num, n_, private_key_));
  }
  return s;
}

const prime = new Set();
let public_key, private_key, n, prime1, prime2, fi, e, d;

primefiller();
setkeys();
const message = "Test Message";
// const coded = encoder(message);

// console.log("key, ", public_key, private_key);

// console.log("Initial message:");
// console.log(message);
// console.log("\n\nThe encoded message(encrypted by public key)\n");
// console.log(coded.join(''));
// console.log("\n\nThe decoded message(decrypted by public key)\n");
// console.log(decoder(coded));

module.exports = {
  setkeys,
  encoder,
  decoder
}