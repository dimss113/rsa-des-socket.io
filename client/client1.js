const io = require('socket.io-client');
const readline = require('readline');
const { setkeys, decoder, encoder } = require('../rsa/rsa');
const { EncryptMessage } = require('../des/encrypt');
const { DecryptMessage } = require('../des/decrypt');
const { send } = require('process');

let { public_key, private_key, n } = setkeys();

const socket = io('http://localhost:3000'); // Sesuaikan dengan alamat server Anda


let clientIds = []; 
let targetClientId = null;
let publicClientKeys = {};
const nonce = Math.floor(Math.random() * 1000);


let desKey = generateDesKey();


function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

let rl = createReadlineInterface();
let r2 = null;
let statusRl = false;




// Menangani pesan dari server
socket.on('privateMessage', (data) => {
  // decrypt message
  let encryptedMessage = data.message;
  let decryptedMessage = DecryptMessage(encryptedMessage, desKey);
  console.log(`[Private] ${data.sender}: ${decryptedMessage}`);
  sendPrivateMessage();
});

socket.on('encryptedMessageStep', (data) => {

  console.log(`[DATA ID ]${data.step}`)

  if (data.step == 1)
  {
    console.log(`[Private] ${data.sender}: ${data.encryptedMessage}`);
  
    // get n of target client
    // let n = publicClientKeys[data.sender].n;
    let encryptedMessage = data.encryptedMessage;
    let decryptedMessage = decoder(encryptedMessage, n, private_key);
  
    console.log(`[Private] ${data.sender}: ${decryptedMessage}`);
  
    // get nonce and sender id
    let [nonce_, senderId] = decryptedMessage.split(',');
    console.log(`nonce: ${nonce_}, senderId: ${senderId}`);
  
    // send encrypted message containe sender nonce and my nonce
    let message = `${nonce_},${nonce}`;
  
    // encrypt message using rsa with public key of target client
    // get public key of target client
    let n_ = publicClientKeys[data.sender].n;
    let public_key_ = publicClientKeys[data.sender].public_key;
    let encryptedMessage_ = encoder(message, public_key_, n_);
    console.log(`encrypted message: ${encryptedMessage_}`);
  
    targetClientId = data.sender;
  
    console.log(`TARGET CLIENT ID: ${targetClientId}`);
  
    // send encrypted message to target client
    // socket.emit('encryptedMessageStep2', { targetClientId: data.sender, encryptedMessage: encryptedMessage_ });
    sendEncryptedStep(2, encryptedMessage_);
    
  }

  if (data.step == 2)
  {
    console.log(`[Private] ${data.sender}: ${data.encryptedMessage}`);

    // decrypt message
    let encryptedMessage = data.encryptedMessage;
    let decryptedMessage = decoder(encryptedMessage, n, private_key);

    console.log(`[Private] ${data.sender}: ${decryptedMessage}`);

    // split nonce1 and nonce2
    let [nonce1, nonce2] = decryptedMessage.split(',');
    if(nonce1 == nonce) {
      console.log("nonce is same");

      // send encrypted nonce2 with target client public key
      let message = `${nonce2}`;
      let targetClientPublicKey = publicClientKeys[data.sender].public_key;
      let targetClientN = publicClientKeys[data.sender].n;
      let encryptedMessage = encoder(message, targetClientPublicKey, targetClientN);

      console.log(`encrypted message: ${encryptedMessage}`);
      sendEncryptedStep(3, encryptedMessage);

      // send des key
      console.log(`des key: ${desKey}`);
      let message_ = `${desKey}`;
      let encryptedMessage_ = encoder(message_, targetClientPublicKey, targetClientN);
      console.log(`encrypted message: ${encryptedMessage_}`);

      socket.emit('desKey', { targetClientId: data.sender, encryptedMessage: encryptedMessage_ });

    }
  }

  if (data.step == 3)
  {
    console.log(`[Private] ${data.sender}: ${data.encryptedMessage}`);

    // decrypt message
    let encryptedMessage = data.encryptedMessage;
    let decryptedMessage = decoder(encryptedMessage, n, private_key);

    console.log(`[Private] 3 ${data.sender}: ${decryptedMessage}`);

    if (decryptedMessage == nonce) {
      // console.log("nonce is same");
      // get des key
      socket.on('desKey', (data) => {
        console.log(`[Private DesKey] ${data.sender}: ${data.encryptedMessage}`);

        let encryptedMessage = data.encryptedMessage;
        let decryptedMessage_ = decoder(encryptedMessage, n, private_key);

        desKey = decryptedMessage_;

        console.log(`[Private DesKey Decrypted] ${data.sender}: ${decryptedMessage_}`);
        
        targetClientId = data.sender;

        // close input ENter target client ID
        rl.close();
        sendPrivateMessage();
      });
    } else 
    {
      //  block communication with target client
      console.log("nonce is not same");
      console.log("block communication with target client");
    }
  }

});

// Menangani perubahan koneksi
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  rl.close();
});

socket.on('readline', (data) => { 
  console.log('readline');  
  if (statusRl)
  {
    r2.close();
    statusRl = false;
  }
  targetClientId = null;
  rl = createReadlineInterface();
});

// Menangani perubahan daftar client yang terhubung
socket.on('connectedClients', (connectedClients) => {

  socket.emit('public_key', { public_key, n });

  socket.on('clientKeys', (clientKeys) => {
    // publicClientKeys = JSON.stringify(clientKeys);
    publicClientKeys = {...clientKeys};
    // console.log(`this is key: ${JSON.stringify(publicClientKeys)}`);
    }
  );



  console.log('Connected clients:');
  connectedClients.forEach((clientId, index) => {
    if (clientId !== socket.id) {
      clientIds.push(clientId);
      console.log(`${index} - ${clientId}`);
    }
  });

  // Menjalankan fungsi untuk mengirim pesan pribadi setelah menampilkan daftar client
  if (!targetClientId) {
  
    rl.question('Enter target client ID: ', (enteredClientId) => {
      targetClientId = enteredClientId;

      // send encrypted message containe nonce and my id
      let message = `${nonce},${socket.id}`;

      // encrypt message using rsa with public key of target client
      // get public key of target client
      try {
        let targetClientPublicKey = publicClientKeys[targetClientId].public_key;

        let targetClientN = publicClientKeys[targetClientId].n;

      // encrypt message
        let encryptedMessage = encoder(message, targetClientPublicKey, targetClientN);

        sendEncryptedStep(1, encryptedMessage);
        rl.close();
        
      }
      catch (err) {
        console.log('client not found');
        rl.close();
      }
      
    });
  } else {
    sendPrivateMessage();
  }
});

// function to generate 4 letter and 4 number from (0-9) and will change every 5 minutes
function generateDesKey() {
  let letters = "abcdefghijklmnopqrstuvwxyz";
  let numbers = "0123456789";
  let desKey = "";

  for (let i = 0; i < 4; i++) {
    desKey += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  for (let i = 0; i < 4; i++) {
    desKey += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return desKey;
}

// run generateDesKey every 5 minutes
setInterval(() => {
  desKey = generateDesKey();
  console.log(desKey);
}, 300000);


function sendEncryptedStep(step, encryptedMessage) {
  socket.emit('encryptedMessageStep', { step, targetClientId, encryptedMessage });
}

// Fungsi untuk mengirim pesan pribadi ke client tertentu


function sendPrivateMessage() {
  
  if (!statusRl) {
    r2 = createReadlineInterface();
    statusRl = true;
  }
  
  r2.question('Enter your private message (or type "exit" to quit): ', (message) => {
    if (message.toLowerCase() === 'exit') {
      r2.close();
      return;
    }

    // encrypt message
    let encryptedMessage = EncryptMessage(message, desKey);
    console.log(`[ENCRYPT MESSAGE] ${desKey} ${encryptedMessage}`);

    // Mengirim pesan pribadi ke server
    socket.emit('privateMessage', { targetClientId, message: encryptedMessage });

    // Menjalankan kembali fungsi untuk mengirim pesan pribadi
    sendPrivateMessage();
  });
}

// Menjalankan fungsi untuk menampilkan daftar client yang terhubung
socket.emit('connectedClients');
