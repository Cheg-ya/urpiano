const { mongoose } = require('./database/database');
const socket = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on('connect', socket => {
  console.log('User connected');

  socket.on('disconnect', () =>{
    console.log('User disconnect');
  });
});

server.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

app.use(express.static('dist'));
app.use(express.json());
