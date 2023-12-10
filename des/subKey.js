// create variable that store index permutation for data encryption standard algorithm - 1

const ip = [57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7,
    56, 48, 40, 32, 24, 16, 8, 0,
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6];

// create variable that store bitselect or expansion table for data encryption standard algorithm - 1

const bitSelect = [31, 0, 1, 2, 3, 4,
            3, 4, 5, 6, 7, 8,
            7, 8, 9, 10, 11, 12,
            11, 12, 13, 14, 15, 16,
            15, 16, 17, 18, 19, 20,
            19, 20, 21, 22, 23, 24,
            23, 24, 25, 26, 27, 28,
            27, 28, 29, 30, 31, 0];

// create variable that store sbox for data encryption standard algorithm - 1

const sbox = [
// sbox 1
[
[14, 4, 13, 1, 2, 15, 11, 8,
3, 10, 6, 12, 5, 9, 0, 7],

[0, 15, 7, 4, 14, 2, 13, 1,
10, 6, 12, 11, 9, 5, 3, 8],

[4, 1, 14, 8, 13, 6, 2, 11,
15, 12, 9, 7, 3, 10, 5, 0],

[15, 12, 8, 2, 4, 9, 1, 7,
5, 11, 3, 14, 10, 0, 6, 13]
],

// sbox 2
[
[15, 1, 8, 14, 6, 11, 3, 4,
9, 7, 2, 13, 12, 0, 5, 10],

[3, 13, 4, 7, 15, 2, 8, 14,
12, 0, 1, 10, 6, 9, 11, 5],

[0, 14, 7, 11, 10, 4, 13, 1,
5, 8, 12, 6, 9, 3, 2, 15],

[13, 8, 10, 1, 3, 15, 4, 2,
11, 6, 7, 12, 0, 5, 14, 9]
],

// sbox 3
[
[10, 0, 9, 14, 6, 3, 15, 5,
1, 13, 12, 7, 11, 4, 2, 8],

[13, 7, 0, 9, 3, 4, 6, 10,
2, 8, 5, 14, 12, 11, 15, 1],

[13, 6, 4, 9, 8, 15, 3, 0,
11, 1, 2, 12, 5, 10, 14, 7],

[1, 10, 13, 0, 6, 9, 8, 7,
4, 15, 14, 3, 11, 5, 2, 12]
],

// sbox 4
[
[7, 13, 14, 3, 0, 6, 9, 10,
1, 2, 8, 5, 11, 12, 4, 15],

[13, 8, 11, 5, 6, 15, 0, 3,
4, 7, 2, 12, 1, 10, 14, 9],

[10, 6, 9, 0, 12, 11, 7, 13,
15, 1, 3, 14, 5, 2, 8, 4],

[3, 15, 0, 6, 10, 1, 13, 8,
9, 4, 5, 11, 12, 7, 2, 14]
],

// sbox 5
[
[2, 12, 4, 1, 7, 10, 11, 6,
8, 5, 3, 15, 13, 0, 14, 9],

[14, 11, 2, 12, 4, 7, 13, 1,
5, 0, 15, 10, 3, 9, 8, 6],

[4, 2, 1, 11, 10, 13, 7, 8,
15, 9, 12, 5, 6, 3, 0, 14],

[11, 8, 12, 7, 1, 14, 2, 13,
6, 15, 0, 9, 10, 4, 5, 3]
],

// sbox 6
[
[12, 1, 10, 15, 9, 2, 6, 8,
0, 13, 3, 4, 14, 7, 5, 11],

[10, 15, 4, 2, 7, 12, 9, 5,
6, 1, 13, 14, 0, 11, 3, 8],

[9, 14, 15, 5, 2, 8, 12, 3,
7, 0, 4, 10, 1, 13, 11, 6],

[4, 3, 2, 12, 9, 5, 15, 10,
11, 14, 1, 7, 6, 0, 8, 13]
],

// sbox 7
[
[4, 11, 2, 14, 15, 0, 8, 13,
3, 12, 9, 7, 5, 10, 6, 1],

[13, 0, 11, 7, 4, 9, 1, 10,
14, 3, 5, 12, 2, 15, 8, 6],

[1, 4, 11, 13, 12, 3, 7, 14,
10, 15, 6, 8, 0, 5, 9, 2],

[6, 11, 13, 8, 1, 4, 10, 7,
9, 5, 0, 15, 14, 2, 3, 12]
],

// sbox 8
[
[13, 2, 8, 4, 6, 15, 11, 1,
10, 9, 3, 14, 5, 0, 12, 7],

[1, 15, 13, 8, 10, 3, 7, 4,
12, 5, 6, 11, 0, 14, 9, 2],

[7, 11, 4, 1, 9, 12, 14, 2,
0, 6, 10, 13, 15, 3, 5, 8],

[2, 1, 14, 7, 4, 10, 8, 13,
15, 12, 9, 0, 3, 5, 6, 11]
]
];

// create variable that store permutation table for data encryption standard algorithm - 1

const p = [15, 6, 19, 20, 28, 11, 27, 16,
            0, 14, 22, 25, 4, 17, 30, 9,
            1, 7, 23, 13, 31, 26, 2, 8,
            18, 12, 29, 5, 21, 10, 3, 24];

// create variable that store IP invers table for data encryption standard algorithm - 1

const ipInvers = [39, 7, 47, 15, 55, 23, 63, 31,
            38, 6, 46, 14, 54, 22, 62, 30,
            37, 5, 45, 13, 53, 21, 61, 29,
            36, 4, 44, 12, 52, 20, 60, 28,
            35, 3, 43, 11, 51, 19, 59, 27,
            34, 2, 42, 10, 50, 18, 58, 26,
            33, 1, 41, 9, 49, 17, 57, 25,
            32, 0, 40, 8, 48, 16, 56, 24];

// create variable that store PC1 table for data encryption standard algorithm - 1

const pc1 = [56, 48, 40, 32, 24, 16, 8,
    0, 57, 49, 41, 33, 25, 17,
    9, 1, 58, 50, 42, 34, 26,
    18, 10, 2, 59, 51, 43, 35,
    62, 54, 46, 38, 30, 22, 14,
    6, 61, 53, 45, 37, 29, 21,
    13, 5, 60, 52, 44, 36, 28,
    20, 12, 4, 27, 19, 11, 3];

// create variable that store PC2 table for data encryption standard algorithm - 1

const pc2 = [13, 16, 10, 23, 0, 4, 2, 27,
    14, 5, 20, 9, 22, 18, 11, 3,
    25, 7, 15, 6, 26, 19, 12, 1,
    40, 51, 30, 36, 46, 54, 29, 39,
    50, 44, 32, 47, 43, 48, 38, 55,
    33, 52, 45, 41, 49, 35, 28, 31];  

// create variable that store left shift table for data encryption standard algorithm - 1

const leftShift = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// create variable that store subKey as array with length 16

let subKey = [];
let binaryValueKey = "";

const subKeyFinder = (key) => {
// convert key to binary
for (let i = 0; i < key.length; i++) {
binaryValueKey += key[i].charCodeAt(0).toString(2).padStart(8, '0');
}

// console.log(`Key: ${binaryValueKey}`);

// convert key to 56 bit
let key56Bit = "";
for (let i = 0; i < pc1.length; i++) {
key56Bit += binaryValueKey[pc1[i]];
}

// console.log(`Kunci Internal: ${key56Bit}`);

// split key to 28 bit
let leftKey = key56Bit.slice(0, 28);
let rightKey = key56Bit.slice(28, 56);

// console.log(`C 0: ${leftKey}`);
// console.log(`D 0: ${rightKey}`);

// create 16 subkey
// console.log("======================= LEFT SHIFT RESULT =======================");
for (let i = 0; i < 16; i++) {
// left shift
leftKey = leftKey.slice(leftShift[i], 28) + leftKey.slice(0, leftShift[i]);
rightKey = rightKey.slice(leftShift[i], 28) + rightKey.slice(0, leftShift[i]);

// console.log(`C ${i + 1}: ${leftKey}`);
// console.log(`D ${i + 1}: ${rightKey}`);

// combine left and right key
let combineKey = leftKey + rightKey;

// convert key to 48 bit
let key48Bit = "";
for (let j = 0; j < pc2.length; j++) {
    key48Bit += combineKey[pc2[j]];
}

// push key to subkey
subKey.push(key48Bit);
// console.log(`K ${i+1}: ${key48Bit}`);
}
}

// create function to text to binary
const textToBinary = (text) => {
let binary = "";
for (let i = 0; i < text.length; i++) {
binary += text[i].charCodeAt(0).toString(2).padStart(8, '0');
}
// console.log(binary);
return binary;
}

// create function to binary to text
const binaryToText = (binaryString) => {
if (binaryString.length % 8 !== 0) {
throw new Error("Panjang string biner harus kelipatan 8.");
}

const binaryChunks = binaryString.match(/.{8}/g); // Membagi string biner menjadi potongan 8-bit
const text = binaryChunks.map(chunk => String.fromCharCode(parseInt(chunk, 2))).join('');
return text;
}

const binaryToHex = (binaryString) => { 
const binaryChunks = binaryString.match(/.{8}/g);

// Convert each 8-bit chunk to a hexadecimal string
const hexString = binaryChunks.map(chunk => parseInt(chunk, 2).toString(16)).join('');
return hexString;
}

const hexToBinary = (hexString) => {
// Convert each hexadecimal string to an integer, then to a binary string
const binaryString = hexString.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
return binaryString;
}


const textToHex = (text) => {
let hex = "";
for (let i = 0; i < text.length; i++) {
hex += text[i].charCodeAt(0).toString(16);
}
return hex;
}

// create function to group binary to 64 bit
const groupingTexts = (binary) => {
let group = [];
for (let i = 0; i < binary.length; i+=64) {
group.push(binary.slice(i, i+64));
}
// console.log(group);
return group;
}

// export module using module.exports
module.exports = {
subKeyFinder,
textToBinary,
binaryToText,
groupingTexts,
subKey,
ip,
bitSelect,
sbox,
p,
ipInvers,
binaryToHex,
hexToBinary,
textToHex
}


