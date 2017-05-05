/* eslint-disable camelcase */
/**
 * Constructor
 * @param {TaskGroup} model Linked model
 */
function TaskGroupView (model) {
  /**
   * Container
   * @type {DOMElement}
   */
  this.container = null

  /**
   * Linked model
   * @type {TaskGroup}
   */
  this.model = model

  /**
   * Progression container to show task finished
   * @type {DOMElement}
   */
  this.progressionContainer = null

  /**
   * Task container
   * @type {DOMElement}
   */
  this.taskContainer = null
}

/**
 * Create a new group of task
 * @param {DOMElement} container Parent element
 * @return {boolean} True if everything was successful
 */
TaskGroupView.prototype.create = function (container) {
  let mainDiv = document.createElement('div')
  mainDiv.className = 'task-container'
  this.container = mainDiv

  // Header div
  const headerDiv = document.createElement('div')

  let progressionDiv = document.createElement('div')
  progressionDiv.className = 'progression'
  progressionDiv.textContent = '0 / 0'
  headerDiv.appendChild(progressionDiv)
  this.progressionContainer = progressionDiv

  let titleInput = document.createElement('input')
  titleInput.className = 'task-group-title'
  titleInput.value = this.model.content
  headerDiv.appendChild(titleInput)

  mainDiv.appendChild(headerDiv)

  // Task list
  const taskList = document.createElement('ul')
  mainDiv.appendChild(taskList)
  this.taskContainer = taskList

  // Add button
  let addButton = document.createElement('button')
  addButton.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i> Create a new task'
  addButton.onclick = () => {
    this.model.createTask('')
  }
  mainDiv.appendChild(addButton)

  // Finally add to the DOM
  container.appendChild(mainDiv)

  return true
}

/**
 * Create a new task
 * @param {number} id The task identifier
 * @param {string} content The content of the task
 * @param {boolean} finished True to set as finished
 * @param {boolean} animate True to animate, otherwise false
 */
TaskGroupView.prototype.createTask = function (id, content, finished, animate) {
  let li = document.createElement('li')
  li.id = `task-${id}`
  li.dataset.id = id

  let statusCheckBox = document.createElement('input')
  statusCheckBox.type = 'checkbox'
  statusCheckBox.checked = finished
  statusCheckBox.onclick = (event) => {
    const { dataset, children } = event.target.parentElement
    const checkbox = children[0]
    const input = children[1]
    this.model.updateTask(dataset.id, input.value, checkbox.checked)
  }
  li.appendChild(statusCheckBox)

  let contentInput = document.createElement('input')
  contentInput.type = 'text'
  contentInput.value = content
  contentInput.onblur = (event) => {
    const { dataset, children } = event.target.parentElement
    const checkbox = children[0]
    const input = children[1]
    this.model.updateTask(dataset.id, input.value, checkbox.checked)
  }
  li.appendChild(contentInput)

  let removeButton = document.createElement('i')
  removeButton.className = 'fa fa-times'
  removeButton.onclick = (event) => {
    this.model.removeTask(event.target.parentElement.dataset.id)
  }
  li.appendChild(removeButton)

  // Animate?
  if (animate) {
    li.className += ' fadeIn'
    setTimeout(() => {
      li.className = ''
      contentInput.focus()
    }, 0)
  }

  this.taskContainer.insertBefore(li, this.taskContainer.firstChild)
}

/**
 * Remove a task
 * @param {number} id The task identifier
 */
TaskGroupView.prototype.removeTask = function (id) {
  const task = document.getElementById(`task-${id}`)
  if (!task) return

  this.taskContainer.removeChild(task)
}

/**
 * Update a task
 * @param {number} id The task identifier
 * @param {string} content Task content
 * @param {string} finished_at Task status
 */
TaskGroupView.prototype.updateTask = function (id, content, finished_at) {
  let task = document.getElementById(`task-${id}`)
  if (!task) return

  task.children[0].checked = (finished_at !== null)
  task.children[1].value = content
}

/**
 * Update progression indicator
 * @param {number} taskFinishedCount Amount of task finished
 * @param {number} taskCount Task count
 */
TaskGroupView.prototype.updateProgression = function (taskFinishedCount, taskCount) {
  this.progressionContainer.innerHTML = `${taskFinishedCount} / ${taskCount}`
}
