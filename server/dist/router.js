'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (socket) {
  console.log('client connect');
  socket.broadcast.emit('newUser', 'New user just connected');

  socket.on('registerUser', function (pseudo, response) {
    // store the pseudo in the socket session for this client
    this.pseudo = pseudo;
    // echo globally (all clients) that a person has connected
    if (pseudo) this.broadcast.emit('newUser', `${pseudo} just connected`
    // confirm user that he registered successfully
    );if (response) response(pseudo);
  }

  // Groups
  );socket.on('getAllGroups', _GroupsController2.default.all);

  socket.on('joinGroup', _GroupsController2.default.joinGroup);

  socket.on('leaveGroup', _GroupsController2.default.leaveGroup);

  socket.on('createGroup', _GroupsController2.default.create);

  socket.on('updateGroup', _GroupsController2.default.update);

  socket.on('removeGroup', _GroupsController2.default.remove

  // Tasks
  );socket.on('getAllTasks', _TasksController2.default.all);

  socket.on('createTask', _TasksController2.default.create);

  socket.on('updateTask', _TasksController2.default.update);

  socket.on('removeTask', _TasksController2.default.remove

  // Tchat
  );socket.on('getAllMessages', _TchatController2.default.all);

  socket.on('sendMessage', _TchatController2.default.create);

  socket.on('updateMessage', _TchatController2.default.update);

  socket.on('removeMessage', _TchatController2.default.remove);

  socket.on('onDisconnect', function () {
    console.log(`${this.pseudo} disconnected`);
    this.broadcast.emit('onDisconnect', `${this.pseudo} disconnected`);
    this.pseudo = null;
    this.group = null;
  });
};

var _GroupsController = require('./controllers/GroupsController');

var _GroupsController2 = _interopRequireDefault(_GroupsController);

var _TasksController = require('./controllers/TasksController');

var _TasksController2 = _interopRequireDefault(_TasksController);

var _TchatController = require('./controllers/TchatController');

var _TchatController2 = _interopRequireDefault(_TchatController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=router.js.map