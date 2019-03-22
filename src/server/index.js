// const { mongoose } = require('./database/database');
const _ = require('lodash');
const socket = require('socket.io');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const clients = {};

io.on('connect', socket => {
  if (!clients[socket.id]) {
    clients[socket.id] = {
      userName: null,
      rooms: []
    };
  }

  socket.on('join', ({ roomName, userName }) => {
    const currentRoom = socket.adapter.rooms[roomName];

    if (!currentRoom) {
      clients[socket.id].userName = userName;
      clients[socket.id].rooms = clients[socket.id].rooms.concat(roomName);

      return socket.join(roomName, () => {
        socket.emit('join', {
          joined: true,
          message: `${userName} has created the room`
        });
      });
    }

    if (currentRoom && currentRoom.length < 2) {
      clients[socket.id].userName = userName;
      clients[socket.id].rooms = clients[socket.id].rooms.concat(roomName);

      socket.join(roomName, () => {
        io.to(roomName).emit('join', {
          joined: true,
          newComer: userName,
          message: `${userName} has joined!`
        });
      });

    } else {
      socket.emit('join', {
        joined: false,
        message: 'No vacancy'
      });
    }
  });

  socket.on('disconnect', () =>{
    const targetName = clients[socket.id].userName;
    const joinedRooms = clients[socket.id].rooms;
    const currentRoomInfo = socket.adapter.rooms;

    if (joinedRooms) {
      joinedRooms.forEach(roomName => {
        const targetRoom = currentRoomInfo[roomName];
  
        if (targetRoom) {
          const roomMembers = _.keys(targetRoom.sockets);
          const isTargetExisted = roomMembers.filter(id => id === socket.id).length;

          if (!isTargetExisted) {
            return io.to(roomName).emit('disconnect', `${targetName} has left the room!`);
          }
        }
      });
    }

    console.log(`${socket.id} disconnected`);
  });

  socket.on('play', ({ roomName, keyNumber }) => {
    const counterpartId = _.keys(socket.adapter.rooms[roomName].sockets).filter(id => id !== socket.id);
    console.log('play: ', keyNumber);
    io.to(counterpartId).emit('play', keyNumber);
  });

  socket.on('stop', ({ roomName, keyNumber }) => {
    const counterpartId = _.keys(socket.adapter.rooms[roomName].sockets).filter(id => id !== socket.id);
    console.log('stop: ', keyNumber);
    io.to(counterpartId).emit('stop', keyNumber);
  });

  socket.on('change', ({ roomName, config }) => {
    console.log(instrument);
    // io.to(socket.id).emit('change', config);
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
