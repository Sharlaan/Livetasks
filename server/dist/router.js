'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (socket) {
  console.log('client connect');
  socket.broadcast.emit('onConnect', 'New client connected');

  socket.on('getAllTasks', _TasksController2.default.all);

  socket.on('createTask', _TasksController2.default.create);

  socket.on('updateTask', _TasksController2.default.update);

  socket.on('removeTask', _TasksController2.default.remove);

  socket.on('onDisconnect', () => {
    console.log('Client disconnected');
    socket.broadcast.emit('onDisconnect', 'Client disconnected');
  });
};

var _TasksController = require('./controllers/TasksController');

var _TasksController2 = _interopRequireDefault(_TasksController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=router.js.map