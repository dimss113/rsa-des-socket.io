const { subKeyFinder, textToBinary, binaryToText, groupingTexts, subKey, ip, bitSelect, sbox, p, ipInvers, binaryToHex, hexToBinary, textToHex } = require("./subKey.js");

let binaryMessageIP = new Array(64).fill('');
let binaryMessageipInvers = new Array(64).fill('');
let tempTrueMessage= [];
let binaryBitSelection = new Array(48).fill('');
let binaryXORE = new Array(48).fill('');
let sboxes = new Array(32).fill('');
let permutation = new Array(32).fill('');

let l = new Array(17).fill('');
let r = new Array(17).fill('');

for (let i = 0; i < 17; i++) {
  l[i] = new Array(32).fill('');
  r[i] = new Array(32).fill('');
}


let rl = new Array(64).fill('');

let tempUnEncryptedMessage = new Array(64).fill('');
let bitSelectGroup = new Array(8);
for (let i = 0; i < 8; i++) {
  bitSelectGroup[i] = new Array(6);
}
let decryptedBinaryMessage = "";
let decryptedMessage = "";
let binaryValueMessage = "";
let messageGroup = [];

// create function to do IndexPermutation binary message with IP table from subKey.js
function IndexPermutation() {
  for (let i = 0; i < ip.length; i++) { 
    binaryMessageIP[i] = tempTrueMessage[ip[i]];

    if (i < 32) {
      l[0][i] = binaryMessageIP[i];
    } else {
      r[0][i - 32] = binaryMessageIP[i];
    }

    // console.log("this is binary message ip ", binaryMessageIP[i]);
  }
  // console.log("this is new l ", l);
  // console.log("this is new r ", r);
  // console.log(`IP: ${binaryMessageIP}`);
}

// create function to determine li and e-bit selection where li = ri - 1, and store E(ri) to binaryBitSelection
function BitSelection(i) {
  for (let j = 0; j < 32; j++) {
    // console.log("this is l ", i, j);
    l[i+1][j] = r[i][j];
  }

  for (let j = 0; j < bitSelect.length; j++) {
    binaryBitSelection[j] = r[i][bitSelect[j]];
   }
}

// create function to do XOR binaryBitSelection with subKey
function XOR(i) {
  // console.log("this is subkey ", subKey[i]);
  for (let j = 0; j < binaryXORE.length; j++) { 
    // console.log("this is subkey ", i, j);
    if (subKey[i][j] == binaryBitSelection[j]) {
      binaryXORE[j] = "0";
    } else {
      binaryXORE[j] = "1";
    }
  }
}

function XOR2(i) {
  for (let j = 0; j < r[i+1].length; j++) {
    if (l[i][j] == permutation[j]) {
      r[i+1][j] = "0";
    } else {
      r[i+1][j] = "1";
    }
  }
}

// create 8 group for sbox that contain 6 bit
// do xor between subkey and bit selection/e(ri)
function Grouping() {
  let start = 0;
  for (let j = 0; j < 8; j++) { 
    for (let k = 0; k < 6; k++) {
      // get string from binaryXORE[start] and parse it to int
      bitSelectGroup[j][k] = parseInt(binaryXORE[start]);
    }
    start+=6;
  }
}

// create function to do sbox
function SBOX() {
  let start = 0;
  let baris = new Array(8).fill(0);
  let kolom = new Array(8).fill(0);

  for (let j = 0; j < 8; j++) {
    if (bitSelectGroup[j][0] != 0) {
      baris[j] = baris[j] + (Math.pow(2,1))
    }
    if (bitSelectGroup[j][1] != 0) {
      kolom[j] = kolom[j] + (Math.pow(2,3))
    }
    if (bitSelectGroup[j][2] != 0) {
      kolom[j] = kolom[j] + (Math.pow(2,2))
    }
    if (bitSelectGroup[j][3] != 0) {
      kolom[j] = kolom[j] + (Math.pow(2,1))
    }
    if (bitSelectGroup[j][4] != 0) {
      kolom[j] = kolom[j] + (Math.pow(2,0))
    }
    if (bitSelectGroup[j][5] != 0) {
      baris[j] = baris[j] + (Math.pow(2,0))
    }
  }

  for (let j = 0; j < 8; j++) {
    let tempB = 0;
    if (j == 0) {
      tempB = sbox[0][baris[j]][kolom[j]];
    }
    if (j == 1) {
      tempB = sbox[1][baris[j]][kolom[j]]
    }
    if (j == 2) {
      tempB = sbox[2][baris[j]][kolom[j]]
    }
    if (j == 3) {
      tempB = sbox[3][baris[j]][kolom[j]]
    }
    if (j == 4) {
      tempB = sbox[4][baris[j]][kolom[j]]
    }
    if (j == 5) {
      tempB = sbox[5][baris[j]][kolom[j]]
    }
    if (j == 6) {
      tempB = sbox[6][baris[j]][kolom[j]]
    }
    if (j == 7) {
      tempB = sbox[7][baris[j]][kolom[j]]
    }

    // console.log("this is tempB ", tempB);
    let tempBinB = tempB.toString(2);
    while (tempBinB.length < 4) {
      tempBinB = "0" + tempBinB;
    }

    let binB = tempBinB.split("");
    for (let k = 0; k < 4; k++) {
      sboxes[start] = binB[k];
      start++;
    }
  }
}
// create function to do permutation
function Permutation() {
  for (let i = 0; i < p.length; i++) {
    permutation[i] = sboxes[p[i]];
  }

  // console.log("this is permutation ", permutation);
}

// create function to do InversIndexPermutation and to connect l16 and r16
function InversIndexPermutation() {
  for (let i = 0; i < 64; i++) {
    if (i < 32) {
      tempUnEncryptedMessage[i] = r[16][i];
    } else {
      tempUnEncryptedMessage[i] = l[16][i - 32];
    }
  }

  for (let i = 0; i < ipInvers.length; i++) {
    binaryMessageipInvers[i] = tempUnEncryptedMessage[ipInvers[i]];
  }

  // convert binaryMessageipInvers to string
  let stringMessage = "";
  for (let i = 0; i < binaryMessageipInvers.length; i++) {
    stringMessage += binaryMessageipInvers[i];
  }

  decryptedBinaryMessage = stringMessage;
}


function DecryptMessage(message, key) { 
  subKeyFinder(key);
  binaryValueMessage = hexToBinary(message);
  messageGroup = groupingTexts(binaryValueMessage);
  for (let x = 0; x < messageGroup.length; x++) { 
    tempTrueMessage = messageGroup[x];
    // console.log("this is tempTrueMessage ", tempTrueMessage);
    IndexPermutation();
    // console.log("\nProcess Enchipering 16 Round");
    for (let i = 0; i < 16; i++) {
      BitSelection(i);
      XOR(16 - (i + 1));
      Grouping();
      SBOX();
      Permutation();
      XOR2(i);

      // console.log(`\nRound ${i + 1}`);
      // console.log(`L${i + 1}: ${l[i + 1]}`);
      // console.log(`R${i + 1}: ${r[i + 1]}`);
    }
    InversIndexPermutation();
    decryptedMessage = (binaryToText(decryptedBinaryMessage));

  }

  // console.log("\nResult");
  // console.log(`Binary: ${decryptedBinaryMessage}`);
  // console.log(`Text: ${binaryToText(decryptedBinaryMessage)}`);
  // console.log(`HEX: ${binaryToHex(decryptedBinaryMessage)}`);

  return decryptedMessage;

}


module.exports = {
  DecryptMessage
}