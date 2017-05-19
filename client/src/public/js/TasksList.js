'use strict'
/* eslint-disable camelcase */
/**
 * List of Tasks constructor
 * @param {number} groupId - Group identifier
 * @param {Socket} socket - socket instance used for communicating with the API
 */
function TasksList (groupId, socket) {
  /**
   * Identifier
   * @type {number}
   */
  this.groupId = groupId

   /**
    * @type {Socket}
    */
  this.socket = socket

  /**
   * Tasks
   * @type {Array.<Object>}
   */
  this.tasks = []

  /**
   * The view
   * @type {TasksListView}
   */
  this.view = new TasksListView(this) // eslint-disable-line no-undef
}

/**
 * Init: synchronously create the view container, then load tasks inside
 * @param {string} name - Group's name
 * @param {DomElement} container - Group's container created by <Groups>
 */
TasksList.prototype.init = function (name, container) {
  this.view.create(name, container)
           .then(() => this.load())

  // Initialize broadcasted event listeners
  this.socket.on('onTaskCreated', data => {
    console.warn('Received broadcasted event onTaskCreated\n', data)
    this.onTaskCreated(data)
  })
  this.socket.on('onTaskUpdated', data => {
    console.warn('Received broadcasted event onTaskUpdated\n', data)
    this.onTaskUpdated(data)
  })
  this.socket.on('onTaskRemoved', data => {
    console.warn('Received broadcasted event onTaskRemoved\n', data)
    this.onTaskRemoved(data.id)
  })
}

/**
 * Load tasks from database
 */
TasksList.prototype.load = function () {
  this.socket.emit(
    'getAllTasks',
    null,
    ({status, message, data: tasks}) => {
      if (status === 'failed') return console.error('Error with getAllTasks fetch\n', message)

      // Sort tasks by finished_at then by created_at properties
      // sort order: "oldest has priority"
      tasks.sort(function (a, b) {
        const af = new Date(a.finished_at)
        const bf = new Date(b.finished_at)
        const ac = new Date(a.created_at)
        const bc = new Date(b.created_at)

        if (af < bf) return -1
        if (af > bf) return 1
        if (ac < bc) return -1
        if (ac > bc) return 1
      })
      // Load tasks
      this.tasks = tasks
      // Create views
      for (let { id, content, finished_at } of tasks) {
        this.view.createTask(id, content, (finished_at !== null))
      }

      // Update progression view
      this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length)
    }
  )
}

/**
 * Create a new task
 * @param {string} content - The content of the task
 */
TasksList.prototype.createTask = function (content) {
  this.socket.emit(
    'createTask',
    JSON.stringify({ groupId: this.groupId, content }),
    ({status, message, data}) => {
      if (status === 'failed') return console.error('Error with createTask fetch\n', message)
      console.log('createTask data', data)
      // Add to the DOM
      this.onTaskCreated(data)
    }
  )
}

/**
 * Update a task
 * @param {number} id - Task identifier
 * @param {string} content - The content of the task
 * @param {boolean} finished - True to set as finished, otherwise false
 */
TasksList.prototype.updateTask = function (id, content, finished) {
  // console.log('TaskList updateTask: Asking server for update (+ broadcast if successful)', {id, content, finished})
  this.socket.emit(
    'updateTask',
    JSON.stringify({ id, content, finished }),
    ({status, message, data}) => {
      if (status === 'failed') return console.error('Error with updateTask fetch\n', message)
      // console.log('Server answered @ TaskList updateTask:', data)
      this.onTaskUpdated(data) // Update the DOM element and its model
    }
  )
}

/**
 * Remove a given task
 * @param {number} id - Task identifier
 */
TasksList.prototype.removeTask = function (id) {
  this.socket.emit(
    'removeTask',
    JSON.stringify({ groupId: this.groupId, id }),
    ({status, message}) => {
      if (status === 'failed') return console.error('Error with removeTask fetch\n', message)
      // console.log'removeTask data', data)
      this.onTaskRemoved(id) // Remove from the DOM
    }
  )
}

/**
 * Call when a task is created
 * @param {number} id - Task identifier
 * @param {string} content - The content of the task
 * @param {Date} created_at - Date of creation
 */
TasksList.prototype.onTaskCreated = function ({ id, content, created_at }) {
  // Give the sorting policy, the newly created task will be inserted
  // at index before the first "done" task.
  const index = this.tasks.findIndex(task => task.finished_at !== null)
  const index2insert = index !== -1 ? index : (this.tasks.length - 1)
  this.tasks.splice(
    index2insert === 0 ? 0 : (index2insert - 1),
    0,
    {id, content, created_at, finished_at: null, deleted_at: null}
  )
  this.view.createTask(id, content, false, index2insert)
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length)
}

/**
 * Call when a task is updated
 * @param {number} id - Task identifier
 * @param {string} content - Task content
 * @param {string} finished_at - Completion date
 */
TasksList.prototype.onTaskUpdated = function ({ id, content, finished_at }) {
  // console.log'onTaskUpdated\nfinished_at', finished_at, '\ncontent', content)
  // Update model
  const task = this.tasks.find(task => task.id === id)
  if (task) {
    task.content = content
    task.finished_at = finished_at
  }

  // Update view
  this.view.updateTask(id, content, finished_at)
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length)
}

/**
 * Call when a task is removed
 * @param {number} id - Task identifier
 */
TasksList.prototype.onTaskRemoved = function (id) {
  // Remove model
  const index = this.tasks.findIndex(task => task.id === +id)
  if (index !== -1) this.tasks.splice(index, 1)

  // Update view
  this.view.removeTask(id)
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length)
}

/**
 * Count un-completed tasks
 * @return {number} - A positive integer
 */
TasksList.prototype.countRemainingTasks = function () {
  return this.tasks.reduce((total, task) => {
    total += task.finished_at === null ? 1 : 0
    return total
  }, 0)
}
