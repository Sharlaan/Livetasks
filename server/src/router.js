import tasksController from './controllers/TasksController'
// import tchatController from './controllers/TchatController'

export default function (socket) {
  console.log('client connect')
  socket.broadcast.emit('onConnect', 'New client connected')

  socket.on('getAllTasks', tasksController.all)

  socket.on('createTask', tasksController.create)

  socket.on('updateTask', tasksController.update)

  socket.on('removeTask', tasksController.remove)

  socket.on('onDisconnect', () => {
    console.log('Client disconnected')
    socket.broadcast.emit('onDisconnect', 'Client disconnected')
  })
}
