import groupsController from './controllers/GroupsController'
import tasksController from './controllers/TasksController'
import tchatController from './controllers/TchatController'

export default function (socket) {
  console.log('client connect')
  socket.broadcast.emit('newUser', 'New user just connected')

  socket.on('registerUser', function (pseudo, response) {
    // store the pseudo in the socket session for this client
    this.pseudo = pseudo
    // echo globally (all clients) that a person has connected
    if (pseudo) this.broadcast.emit('newUser', `${pseudo} just connected`)
    // confirm user that he registered successfully
    if (response) response(pseudo)
  })

  // Groups
  socket.on('getAllGroups', groupsController.all)

  socket.on('joinGroup', groupsController.joinGroup)

  socket.on('leaveGroup', groupsController.leaveGroup)

  socket.on('createGroup', groupsController.create)

  socket.on('updateGroup', groupsController.update)

  socket.on('removeGroup', groupsController.remove)

  // Tasks
  socket.on('getAllTasks', tasksController.all)

  socket.on('createTask', tasksController.create)

  socket.on('updateTask', tasksController.update)

  socket.on('removeTask', tasksController.remove)

  // Tchat
  socket.on('getAllMessages', tchatController.all)

  socket.on('sendMessage', tchatController.create)

  socket.on('updateMessage', tchatController.update)

  socket.on('removeMessage', tchatController.remove)

  socket.on('onDisconnect', function () {
    console.log(`${this.pseudo} disconnected`)
    this.broadcast.emit('onDisconnect', `${this.pseudo} disconnected`)
    this.pseudo = null
    this.group = null
  })
}
