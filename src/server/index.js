const { mongoose } = require('./database/database');
const socket = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socket(server);

io.of('/duo').on('connect', socket => {
  console.log('User connected, id: '+ socket.id);

  socket.on('join', (id, name) => {
    // debugger;
  });

  socket.on('play', (midiNumber, gp) => {
    socket.emit('play', 'play success');
    console.log('keyNumber: ' + midiNumber, gp);
  });
  
  socket.on('disconnect', () =>{
    console.log('User disconnect');
  });
});

server.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

app.use(express.static('dist'));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  console.log("Production");
} else {
  console.log("Development");
}
