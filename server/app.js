const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connectedClients = {};

let clientKeys = {};

io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);

  // Menambahkan client ke objek connectedClients
  connectedClients[socket.id] = true;

  // Mengirim daftar client yang terhubung ke semua client
  io.emit('connectedClients', Object.keys(connectedClients));

  socket.on('public_key', (data) => {
    // push public key to clientKeys
    clientKeys[socket.id] = data;
    console.log(clientKeys);
    io.emit('clientKeys', clientKeys);
    }
  );

  // Menangani pesan dari client
  socket.on('privateMessage', (data) => {
    const { targetClientId, message } = data;
    console.log(`Private message from ${socket.id} to ${targetClientId}: ${message}`);

    // Mengirim pesan ke client tertentu
    io.to(targetClientId).emit('privateMessage', {
      sender: socket.id,
      message
    });
  });

  socket.on('encryptedMessageStep', (data) => {
    const { step, targetClientId, encryptedMessage } = data;
    console.log(`${step} - Private message from ${socket.id} to ${targetClientId}: ${encryptedMessage}`);

    // Mengirim pesan ke client tertentu
    io.to(targetClientId).emit('encryptedMessageStep', {
      step: step,
      sender: socket.id,
      encryptedMessage
    });
  });


  socket.on('desKey', (data) => {
    const { targetClientId, encryptedMessage } = data;
    console.log(`Private message from ${socket.id} to ${targetClientId}: ${encryptedMessage}`);

    // Mengirim pesan ke client tertentu
    io.to(targetClientId).emit('desKey', {
      sender: socket.id,
      encryptedMessage
    });
    
    
  });

  // Menangani event disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);

    // Menghapus client dari objek connectedClients
    delete connectedClients[socket.id];
    delete clientKeys[socket.id];

    // Mengirim daftar client yang terhubung ke semua client setelah ada perubahan
    io.emit('readline', true);
    io.emit('connectedClients', Object.keys(connectedClients));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
