/**
 * Responsible for notifying other clients
 * for events triggered from current client
 */
export default class TasksPushNotifier {
  constructor (socket) {
    this.socket = socket
  }

  newClient (request, response) {
    console.log('TasksPushNotifier newClient')
    this.socket.broadcast.emit('onConnect', this.socket)
  }.bind(this)

  create (request, response) {
    console.log('TasksPushNotifier createdTask', response.locals.createdTask)
    const { id, group_id, content, created_at } = response.locals.createdTask
    this.socket.broadcast.emit('onTaskCreated', {
      groupId: group_id,
      taskId: id,
      taskContent: content,
      taskCreationDate: created_at
    })
  }

  update (request, response) {
    console.log('TasksPushNotifier updatedTask', response.locals.updatedTask)
    const { id, group_id, content, created_at, finished_at } = response.locals.updatedTask
    this.socket.broadcast.emit('onTaskUpdated', {
      groupId: group_id,
      taskId: id,
      taskContent: content,
      taskCreationDate: created_at,
      taskFinished: finished_at
    })
  }

  remove (request, response) {
    console.log('TasksPushNotifier removedID', response.locals.id)
    this.socket.broadcast.emit('onTaskRemoved', response.locals.id)
  }
}
