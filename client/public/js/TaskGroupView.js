'use strict'
/* eslint-disable camelcase */
/**
 * Constructor
 * @param {TaskGroup} model - Linked model
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
   * Completion container to show task finished
   * @type {DOMElement}
   */
  this.completionContainer = null

  /**
   * Task container
   * @type {DOMElement}
   */
  this.taskContainer = null
}

/**
 * Create a new group of task
 * @param {DOMElement} container - Parent element
 * @return {boolean} True if everything was successful
 */
TaskGroupView.prototype.create = function (container) {
  let mainDiv = document.createElement('div')
  mainDiv.className = 'task-container'
  this.container = mainDiv

  // Header div
  const headerDiv = document.createElement('header')
  headerDiv.className = 'task-group-header'

  let groupTitle = document.createElement('h3')
  groupTitle.className = 'task-group-title'
  groupTitle.textContent = 'Project 1' // TODO: link this to group name from DB
  headerDiv.appendChild(groupTitle)

  let completionDiv = document.createElement('div')
  completionDiv.className = 'completionDiv'
  completionDiv.title = 'Remaining tasks'
  headerDiv.appendChild(completionDiv)
  this.completionContainer = completionDiv

  let actionsMenuButton = document.createElement('button')
  actionsMenuButton.innerHTML = '<i class="material-icons">more_vert</i>'
  actionsMenuButton.className = 'actionsMenuButton'
  actionsMenuButton.addEventListener('click', function () {
    const menu = this.children[1]
    menu.style.visibility = 'visible' // make this as class 'showMenu' ?
    menu.style.opacity = 1
  })
  actionsMenuButton.addEventListener('keyup', function (event) {
    const menu = this.children[1]
    if (event.key === 'Escape') {
      menu.style.visibility = 'hidden' // make this as class 'closeMenu' ?
      menu.style.opacity = 0
    }
  })
  actionsMenuButton.addEventListener('blur', function (event) {
    const menu = this.children[1]
    if (!this.contains(event.relatedTarget)) {
      menu.style.visibility = 'hidden' // make this as class 'closeMenu' ?
      menu.style.opacity = 0
    }
  })
  headerDiv.appendChild(actionsMenuButton)

  let actionsMenu = document.createElement('div')
  actionsMenu.innerHTML = `
    <button class='create-group'>
      <i class='material-icons'>playlist_add</i>
      Create new group of tasks<br/>(un-implemented)
    </button></li>
    <button class='edit-group-title'>
      <i class='material-icons'>input</i>
      Edit this group's title<br/>(un-implemented)
    </button>
    <button class='add-new-task'>
      <i class='material-icons'>add</i>
      Add new task
    </button>`
  actionsMenu.className = 'actionsMenu'
  actionsMenu.addEventListener('click', event => {
    event.stopPropagation()
    event.currentTarget.style.visibility = 'hidden' // make this as class 'closeMenu' ?
    event.currentTarget.style.opacity = 0

    if (event.target.classList.contains('add-new-task')) this.model.createTask('')
  })
  actionsMenuButton.appendChild(actionsMenu)

  // TODO: Add input for edition of group title
  // TODO: create new group button

  mainDiv.appendChild(headerDiv)

  // Task list
  const taskList = document.createElement('ul')
  taskList.className = 'task-list'
  mainDiv.appendChild(taskList)
  this.taskContainer = taskList

  // Finally add to the DOM
  container.appendChild(mainDiv)

  return true
}

/**
 * Create a new task
 * @param {number} id - The task identifier
 * @param {string} content - The content of the task
 * @param {boolean} status - True to set as completed
 * @param {boolean} justCreated - flag to give focus on the content input after task creation
 */
TaskGroupView.prototype.createTask = function (id, content, status, justCreated = false) {
  let task = document.createElement('li')
  task.className = 'task'
  task.id = `task-${id}`
  task.dataset.id = id
  // TODO: see if the handler can be generic'ed
  task.addEventListener('click', ({currentTarget: ct}) => {
    // use e.currentTarget to be sure to use the attached node instead of e.target which can be some child
    // use e.currentTarget when in lexical mode (arrow function), or this in normal function(event) mode
    const checkbox = ct.firstChild
    const id = ct.dataset.id
    const content = ct.children[1].value
    const newChecked = !JSON.parse(checkbox.dataset.checked) // /!\ data-* value is always a string
    // console.log('Event triggered @ TaskGroupView createTask: newChecked', checkbox)
    this.model.updateTask(id, content, newChecked)
  })

  let statusCheckbox = document.createElement('div')
  statusCheckbox.className = 'statusCheckbox'
  statusCheckbox.dataset.checked = status
  // TODO: use 'done_all' to check/uncheck all tasks at once
  statusCheckbox.innerHTML = '<i class="material-icons">done</i>'
  if (!status) statusCheckbox.classList.add('hide')
  /* ou
   `<i class='material-icons'>
      ${status ? 'check_box' : 'check_box_outline_blank'}
    </i>` */
  task.appendChild(statusCheckbox)

  let contentInput = document.createElement('input')
  contentInput.type = 'text'
  contentInput.dataset.currentContent = content
  contentInput.value = content
  contentInput.readOnly = true
  contentInput.className = 'taskContent'
  if (!content.length) contentInput.placeholder = 'Write a task ...'
  if (status) contentInput.classList.add('strike')
  // Prevent triggering task.click() event, only when editing (bubbling propagation)
  contentInput.addEventListener('click', function (event) {
    const isEditing = !this.readOnly
    if (isEditing) event.stopPropagation()
  })
  // Save previous value before editing
  contentInput.addEventListener('focus', function () {
    const isEditing = !this.readOnly
    if (isEditing) this.dataset.currentContent = this.value
  })
  contentInput.addEventListener('blur', ({currentTarget: ct}) => {
    ct.readOnly = true
    const task = ct.parentElement
    const currentContent = ct.dataset.currentContent
    const checkbox = task.firstChild
    const id = task.dataset.id
    const newContent = ct.value
    const checked = JSON.parse(checkbox.dataset.checked) // /!\ data-* value is always a string
    // Prevent useless server call
    if (newContent !== currentContent) {
      // console.log('Event triggered @ TaskGroupView createTask: newContent', newContent)
      this.model.updateTask(id, newContent, checked)
    }
  })
  contentInput.addEventListener('keyup', function (event) {
    switch (event.key) {
      case 'Escape':
      case 'Enter':
        this.blur() // Triggers event defined above
        break
      default: break
    }
  })
  task.appendChild(contentInput)

  let actionsBox = document.createElement('div')
  actionsBox.className = 'actionsBox'
  task.appendChild(actionsBox)

  let editButton = document.createElement('button')
  editButton.innerHTML = '<i class="material-icons edit">mode_edit</i>' // or 'input'
  editButton.title = 'Edit'
  editButton.addEventListener('click', event => {
    event.stopPropagation() // necessary to prevent triggering task.click() by bubbling
    const task = event.currentTarget.parentElement.parentElement
    const contentInput = task.children[1]
    contentInput.readOnly = false
    contentInput.focus()
  })
  actionsBox.appendChild(editButton)

  let removeButton = document.createElement('button')
  removeButton.innerHTML = '<i class="material-icons remove">clear</i>'
  removeButton.title = 'Delete'
  removeButton.addEventListener('click', event => {
    event.stopPropagation()
    const confirmation = confirm('Are you sure to delete this task ?') // eslint-disable-line no-undef
    const task = event.currentTarget.parentElement.parentElement
    if (confirmation) this.model.removeTask(task.dataset.id)
  })
  actionsBox.appendChild(removeButton)

  this.taskContainer.insertBefore(task, this.taskContainer.firstChild)
  // Give focus to the content input for the user-created task
  if (justCreated) task.querySelector('i.edit').click()
}

/**
 * Update a task
 * @param {number} id - The task identifier
 * @param {string} content - Task content
 * @param {string} finished_at - Completion date
 */
TaskGroupView.prototype.updateTask = function (id, content, finished_at) {
  let task = document.getElementById(`task-${id}`)
  if (!task) return
  const statusCheckbox = task.firstChild
  const contentInput = task.children[1]
  const status = (finished_at !== null)
  statusCheckbox.dataset.checked = status
  if (status) {
    statusCheckbox.classList.remove('hide')
    contentInput.classList.add('strike')
  } else {
    statusCheckbox.classList.add('hide')
    contentInput.classList.remove('strike')
  }
  contentInput.value = content
}

/**
 * Remove a task
 * @param {number} id - The task identifier
 */
TaskGroupView.prototype.removeTask = function (id) {
  const task = document.getElementById(`task-${id}`)
  if (!task) return

  this.taskContainer.removeChild(task)
}

/**
 * Update completion indicator
 * @param {number} taskRemainingCount - Amount of uncompleted task(s)
 * @param {number} taskCount - Task count
 */
TaskGroupView.prototype.updateCompletion = function (taskRemainingCount, taskCount) {
  this.completionContainer.innerHTML = `${taskRemainingCount} / ${taskCount}`
  if (Number.isFinite(taskCount)) this.completionContainer.title = // eslint-disable-line curly
    `Remaining tasks
(completion ${(((taskCount - taskRemainingCount) / taskCount) * 100).toFixed(1)} %)`
}
