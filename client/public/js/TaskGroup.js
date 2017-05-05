/* eslint-disable camelcase */
/**
 * Group constructor
 * @param {number} id Group identifier
 * @param {string} name Group Name
 */
function TaskGroup (id, name, app) {
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
  this.baseApiUrl = app.baseApiUrl

   /**
    * @type {Socket}
    */
  this.socket = app.socket

  /**
   * Socket url from which to dispatch data to other users
   * @type {string}
   */
  this.baseSocketUrl = app.baseSocketUrl

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
 * @param {DomElement} container Container/Parent element
 * @return {boolean} True if everything was successful, otherwise false
 */
TaskGroup.prototype.init = function (container) {
  return this.view.create(container, this)
}

/**
 * Load tasks from an array
 * @param {Array.<Object} tasks The tasks
 */
TaskGroup.prototype.load = function (tasks) {
  // Load tasks
  this.tasks = tasks
  console.debug('TaskGroup load', tasks)
  // Create views
  for (let { id, content, finished_at } of tasks) {
    this.view.createTask(id, content, (finished_at !== null), false)
  }

  // Update progression view
  this.view.updateProgression(this.countFinishedTasks(), this.tasks.length)
}

/**
 * Create a new task
 * @param {string} content The content of the task
 */
TaskGroup.prototype.createTask = function (content) {
  fetch(`${this.baseApiUrl}/tasks`, { // eslint-disable-line no-undef
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ content })
  })
  .then(response => response.json())
  .then(({data}) => {
    // Notify other clients
    this.socket.emit('tasks', {groupId: this.id, type: 'create', taskId: data.id})

    // Add to the DOM
    this.onTaskCreated(data)
  })
  .catch(error => console.error('Error with createTask fetch', error))
}

/**
 * Remove a given task
 * @param {number} id Task identifier
 */
TaskGroup.prototype.removeTask = function (id) {
  fetch(`${this.baseApiUrl}/tasks`, { // eslint-disable-line no-undef
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ id })
  })
  .then(() => {
    // Notify other clients
    this.socket.emit('tasks', {groupId: this.id, type: 'remove', taskId: id})

    // Remove from the DOM
    this.onTaskRemoved(id)
  })
  .catch(error => console.error('Error with removeTask fetch', error))
}

/**
 * Update a task
 * @param {number} id Task identifier
 * @param {string} content The content of the task
 * @param {boolean} finished True to set as finished, otherwise false
 */
TaskGroup.prototype.updateTask = function (id, content, finished) {
  fetch(`${this.baseApiUrl}/tasks`, { // eslint-disable-line no-undef
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ id, content, finished: !!finished })
  })
    .then(() => {
      // Notify other clients
      finished = finished ? new Date().getTime() : null
/*
      this.socket.emit('tasks', {
        groupId: this.id,
        type: 'update',
        taskId: id,
        taskContent: content,
        taskFinished: finished
      })
*/

      // Update the DOM element
      this.onTaskUpdated(id, content, finished)
    })
    .catch(error => console.error('Error with updateTask fetch', error))
}

/**
 * Call when a task is created
 * @param {number} id Task identifier
 * @param {string} content The content of the task
 */
TaskGroup.prototype.onTaskCreated = function ({ id, content }) {
  this.tasks.push({id, content, created_at: new Date().getTime(), finished_at: null, deleted_at: null})
  this.view.createTask(id, content, false, true)
  this.view.updateProgression(this.countFinishedTasks(), this.tasks.length)
}

/**
 * Call when a task is removed
 * @param {number} id Task identifier
 */
TaskGroup.prototype.onTaskRemoved = function (id) {
  // Remove model
  const index = this.tasks.findIndex(task => task.id === id)
  if (index !== -1) this.tasks.splice(index, 1)

  // Update view
  this.view.removeTask(id)
  this.view.updateProgression(this.countFinishedTasks(), this.tasks.length)
}

/**
 * Call when a task is updated
 * @param {number} id Task identifier
 * @param {string} content Task content
 * @param {string} finished_at Task status
 */
TaskGroup.prototype.onTaskUpdated = function (id, content, finished_at) {
  console.debug('onTaskUpdated', finished_at)
  // Update model
  const index = this.tasks.findIndex(task => task.id === id)
  if (index !== -1) {
    this.tasks[index].content = content
    this.tasks[index].finished_at = finished_at
  }

  // Update view
  this.view.updateTask(id, content, finished_at)
  this.view.updateProgression(this.countFinishedTasks(), this.tasks.length)
}

/**
 * Count completed tasks
 * @return {number} A positive integer
 */
TaskGroup.prototype.countFinishedTasks = function () {
  return this.tasks.reduce((total, task) => {
    return total += task.finished_at !== null ? 1 : 0 // eslint-disable-line no-return-assign
  }, 0)
}
