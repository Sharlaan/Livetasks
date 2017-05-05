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
  // this.CLIENT_PORT = 3000
  this.API_PORT = 3210
  this.SOCKET_PORT = 8000

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
  this.groups = []
}

/**
 * Init application: link to the dom and prepare data
 */
App.prototype.init = function () {
  this.container = document.getElementById('task-container')
  this.socket = io.connect(this.baseApiUrl) // eslint-disable-line no-undef
}

/**
 * Load group of tasks
 */
App.prototype.load = function () {
  // Load group of tasks
  /*
  this.socket.emit('connect', data => {
    // Assume one group of task for now. Next feature: allow multiple groups
    const taskGroup = new TaskGroup(1, 'My tasks', this) // eslint-disable-line no-undef
    if (taskGroup.init(this.container)) taskGroup.load(data)
    this.groups.push(taskGroup)
  })
  */
  fetch(`${this.baseApiUrl}/tasks`) // eslint-disable-line no-undef
    .then(response => response.json())
    .then(({data}) => {
      // Assume one group of task for now. Next feature: allow multiple groups
      const taskGroup = new TaskGroup(1, 'My tasks', this) // eslint-disable-line no-undef
      if (taskGroup.init(this.container)) taskGroup.load(data)
      this.groups.push(taskGroup)
    })
    .catch(error => console.error('Error with getAllTasks fetch\n', error))

  // Listen to broadcasted tasks events
  this.socket.on('onConnect', () => {
    console.warn('New client connected')
  })
  this.socket.on('onTaskCreated', data => {
    console.warn('Received event onTaskCreated', data)
  })
  this.socket.on('onTaskUpdated', data => {
    console.warn('Received event onTaskUpdated', data)
  })
  this.socket.on('onTaskRemoved', data => {
    console.warn('Received event onTaskRemoved', data)
  })

 /*  this.socket.on('tasks', (type, groupId, taskId, taskContent, taskFinished) => {
    console.warn('Received event tasks')
    for (let group of this.groups) {
      if (group.id === groupId) {
        switch (type) {
          case 'create':
            group.onTaskCreated(taskId)
            break
          case 'update':
            group.onTaskUpdated(taskId, taskContent, taskFinished)
            break
          case 'remove':
            group.onTaskRemoved(taskId)
            break
          default: break
        }
      }
    }
  })
  */
}
