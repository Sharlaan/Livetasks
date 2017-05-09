'use strict'
/* eslint-disable camelcase */
/**
 * Group constructor
 * @param {number} id - Group identifier
 * @param {string} name - Group Name
 * @param {string} baseApiUrl - URL for the API from which to fetch/send data
 * @param {Socket} socket - socket instance used for communicating with the API
 */
function TaskGroup (id, name, baseApiUrl, socket) {
  /**
   * Identifier
   * @type {number}
   */
  this.id = id

  /**
   * Name
   * @type {string}
   */
  this.name = name

  /**
   * API url from which to fetch data
   * @type {string}
   */
  this.baseApiUrl = baseApiUrl

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
   * @type {TaskGroupView}
   */
  this.view = new TaskGroupView(this) // eslint-disable-line no-undef
}

/**
 * Init
 * @param {DomElement} container - Container/Parent element
 * @return {boolean} True if everything was successful, otherwise false
 */
TaskGroup.prototype.init = function (container) {
  return this.view.create(container, this)
}

/**
 * Load tasks from an array
 * @param {Array.<Object>} tasks - The tasks
 */
TaskGroup.prototype.load = function (tasks) {
  // Load tasks
  this.tasks = tasks
  // Create views
  for (let { id, content, finished_at } of tasks) {
    this.view.createTask(id, content, (finished_at !== null))
  }

  // Update progression view
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length)
}

/**
 * Create a new task
 * @param {string} content - The content of the task
 */
TaskGroup.prototype.createTask = function (content) {
  this.socket.emit(
    'createTask',
    JSON.stringify({ groupId: this.id, content }),
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
TaskGroup.prototype.updateTask = function (id, content, finished) {
  // console.log('TaskGroup updateTask: Asking server for update (+ broadcast if successful)', {id, content, finished})
  this.socket.emit(
    'updateTask',
    JSON.stringify({ id, content, finished }),
    ({status, message, data}) => {
      if (status === 'failed') return console.error('Error with updateTask fetch\n', message)
      // console.log('Server answered @ TaskGroup updateTask:', data)
      this.onTaskUpdated(data) // Update the DOM element and its model
    }
  )
}

/**
 * Remove a given task
 * @param {number} id - Task identifier
 */
TaskGroup.prototype.removeTask = function (id) {
  this.socket.emit(
    'removeTask',
    JSON.stringify({ groupId: this.id, id }),
    ({status, message, data}) => {
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
TaskGroup.prototype.onTaskCreated = function ({ id, content, created_at }) {
  this.tasks.push({id, content, created_at, finished_at: null, deleted_at: null})
  this.view.createTask(id, content, false, true)
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length)
}

/**
 * Call when a task is updated
 * @param {number} id Task - identifier
 * @param {string} content - Task content
 * @param {string} finished_at - Completion date
 */
TaskGroup.prototype.onTaskUpdated = function ({ id, content, finished_at }) {
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
TaskGroup.prototype.onTaskRemoved = function (id) {
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
TaskGroup.prototype.countRemainingTasks = function () {
  return this.tasks.reduce((total, task) => {
    return total += task.finished_at === null ? 1 : 0 // eslint-disable-line no-return-assign
  }, 0)
}