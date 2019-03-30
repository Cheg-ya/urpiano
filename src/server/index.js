const socket = require('socket.io');
const express = require('express');
const https = require('https');
const http = require('http');
const _ = require('lodash');
const fs = require('fs');

const app = express();
let server;
let io;

if (process.env.NODE_ENV === "production") {
  console.log("Production");
  server = http.createServer(app);
  io = socket(server);

  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && (!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
      res.redirect('https://' + req.get('Host') + req.url);
    } else {
      next();
    }
  });

  app.use(express.static('dist'));
  app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: './dist/' });  
  });

} else {
  console.log("Development");
  const privateKey  = fs.readFileSync(__dirname + '/credential/server.csr.key');
  const certificate = fs.readFileSync(__dirname + '/credential/server.crt');
  const options = {
    key: privateKey,
    cert: certificate
  };

  server = https.createServer(options, app);
  io = socket(server);
}

const clients = {};

const getCounterpartIds = (target, roomName) => {
  if (!target.adapter.rooms[roomName]) {
    return false;
  }

  return _.keys(target.adapter.rooms[roomName].sockets).filter(id => id !== target.id)[0];
};

io.on('connect', socket => {
  if (!clients[socket.id]) {
    clients[socket.id] = {
      userName: null,
      peerId: null,
      rooms: []
    };
  }

  socket.on('join', ({ roomName, userName }) => {
    const currentRoom = socket.adapter.rooms[roomName];

    if (!currentRoom) {
      clients[socket.id].userName = userName;
      clients[socket.id].rooms = clients[socket.id].rooms.concat(roomName);

      return socket.join(roomName, () => {
        io.to(roomName).emit('join', {
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
          partnerJoined: true,
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
    if (!clients[socket.id]) {
      return;
    }

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
            const counterpartId = getCounterpartIds(socket, roomName);
            delete clients[socket.id];

            io.to(counterpartId).emit('reset');

            return io.to(roomName).emit('disconnect', {
              userName: targetName
            });
          }
        }
      });
    }

    delete clients[socket.id];

    console.log(`${socket.id} disconnected`);
  });

  socket.on('play note', ({ roomName, keyNumber }) => {
    const counterpartId = getCounterpartIds(socket, roomName);
    io.to(counterpartId).emit('play', keyNumber);
  });

  socket.on('stop note', ({ roomName, keyNumber }) => {
    const counterpartId = getCounterpartIds(socket, roomName);
    io.to(counterpartId).emit('stop', keyNumber);
  });

  socket.on('change config', ({ roomName, instrumentName, noteRange }) => {
    const counterpartId = getCounterpartIds(socket, roomName);
    
    io.to(counterpartId).emit('change', {
      instrumentName,
      noteRange
    });
  });

  socket.on('send message', ({ roomName, message }) => {
    const userName = clients[socket.id].userName;

    io.to(roomName).emit('receive message', {
      message,
      userName
    });
  });

  socket.on('voice connection', ({ peerId, roomName }) => {
    const counterpartId = getCounterpartIds(socket, roomName);

    if (counterpartId) {
      const counterpartPeerId = clients[counterpartId].peerId;

      io.to(counterpartId).emit('receive peerId', peerId);
      io.to(socket.id).emit('receive peerId', counterpartPeerId);
    }

    clients[socket.id].peerId = peerId;
  });

  socket.on('voice disconnection', roomName => {
    const counterpartId = getCounterpartIds(socket, roomName);

    if (counterpartId) {
      io.to(counterpartId).emit('hang up', true);
    } else {
      io.to(socket.id).emit('hang up', false);
    }
  });
});

server.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
