'use strict'

function App () {
  /**
   * Set API and Socket URLs
   * @type {String}
   */
  // this.CLIENT_URL = 'localhost'
  this.API_URL = 'localhost'

  /**
   * Set API and Socket ports
   * @type {Number}
   */
  this.API_PORT = 3210

  this.baseApiUrl = `http://${this.API_URL}:${this.API_PORT}`

  /**
   * Application container
   * @type {DomElement}
   */
  this.container = null

  /**
   * @type {Socket}
   */
  this.socket = null

  /**
   * Array of TaskGroup
   * @type {Array.<TaskGroup>}
   */
  // TODO: Add some 'general' group at index 0
  this.groups = []
}

/**
 * Init application: link to the dom and prepare data
 */
App.prototype.init = function () {
  this.container = document.getElementById('root')
  this.socket = io.connect(this.baseApiUrl) // eslint-disable-line no-undef
}

/**
 * Load group of tasks
 */
App.prototype.load = function () {
  // Load group of tasks
  this.socket.emit(
    'getAllTasks',
    null,
    ({status, message, data}) => {
      if (status === 'failed') return console.error('Error with getAllTasks fetch\n', message)
      // Assume one group of task for now. Next feature: allow multiple groups
      const initialGroupID = 1
      const taskGroup = new TaskGroup(initialGroupID, 'My tasks', this.baseApiUrl, this.socket) // eslint-disable-line no-undef
      if (taskGroup.init(this.container)) taskGroup.load(data)
      this.groups[initialGroupID] = taskGroup
    }
  )

  // Listen to broadcasted tasks events
  this.socket.on('onConnect', () => {
    console.warn('New client connected')
  })
  this.socket.on('onTaskCreated', data => {
    console.warn('Received broadcasted event onTaskCreated\n', data)
    const group = this.groups[data.group_id]
    group.onTaskCreated(data)
  })
  this.socket.on('onTaskUpdated', data => {
    console.warn('Received broadcasted event onTaskUpdated\n', data)
    const group = this.groups[data.group_id]
    group.onTaskUpdated(data)
  })
  this.socket.on('onTaskRemoved', data => {
    console.warn('Received broadcasted event onTaskRemoved\n', data)
    const group = this.groups[data.groupId]
    group.onTaskRemoved(data.id)
  })
}
