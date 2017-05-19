'use strict'
/* eslint-disable camelcase */
/**
 * Constructor
 * @param {TasksList} model - Linked model
 */
function TasksListView (model) {
  /**
   * Linked model
   * @type {TasksList}
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

  /**
   * container for task's actions (edit/remove)
   * @type {DOMElement}
   */
  this.taskActions = null

  /**
   * Task currently hovered/focused
   * @type {DOMElement}
   */
  this.currentTask = null
}

/**
 * Create a new group of task
 * @param {string} name - Group's name
 * @param {DOMElement} container - Parent element
 * @return {promise} Resolved Promise if everything was successful
 */
TasksListView.prototype.create = function (name, container) {
  let mainDiv = document.createElement('div')
  mainDiv.className = 'tasksList-container'

  // Header
  const headerDiv = document.createElement('header')
  headerDiv.className = 'tasksList-header'

  let groupTitle = document.createElement('h3')
  groupTitle.className = 'tasksList-title'
  groupTitle.textContent = name
  headerDiv.appendChild(groupTitle)

  let completionDiv = document.createElement('div')
  completionDiv.className = 'completionDiv'
  completionDiv.title = 'Remaining tasks'
  headerDiv.appendChild(completionDiv)
  this.completionContainer = completionDiv

  let newTaskButton = document.createElement('button')
  newTaskButton.innerHTML = '<i class="material-icons">add</i>'
  newTaskButton.className = 'newTaskButton'
  newTaskButton.title = 'Add new task'
  newTaskButton.addEventListener('click', () => {
    const newContent = prompt('Please type the content for this new task:') // eslint-disable-line no-undef
    if (newContent) this.model.createTask(newContent)
  })
  headerDiv.appendChild(newTaskButton)

  mainDiv.appendChild(headerDiv)

  // Task list
  const taskList = document.createElement('ul')
  taskList.className = 'task-list'
  taskList.addEventListener('mouseleave', () => {
    this.taskActions.style.display = 'none'
    this.currentTask = null
  })
  mainDiv.appendChild(taskList)
  this.taskContainer = taskList

  // Edit/Remove buttons
  let actionsBox = document.createElement('div')
  actionsBox.className = 'actionsBox'
  actionsBox.addEventListener('mouseenter', () => {
    this.currentTask.classList.add('active')
  })
  actionsBox.addEventListener('mouseleave', () => {
    this.currentTask.classList.remove('active')
  })
  taskList.appendChild(actionsBox)
  this.taskActions = actionsBox

  let editButton = document.createElement('button')
  editButton.className = 'edit'
  editButton.innerHTML = '<i class="material-icons">mode_edit</i>' // or 'input'
  editButton.title = 'Edit'
  editButton.addEventListener('click', () => {
    const contentInput = this.currentTask.children[1]
    contentInput.removeAttribute('readonly')
    contentInput.focus()
  })
  actionsBox.appendChild(editButton)

  let removeButton = document.createElement('button')
  removeButton.className = 'remove'
  removeButton.innerHTML = '<i class="material-icons">clear</i>'
  removeButton.title = 'Delete'
  removeButton.addEventListener('click', () => {
    const confirmation = confirm('Are you sure to delete this task ?') // eslint-disable-line no-undef
    if (confirmation) this.model.removeTask(this.currentTask.dataset.id)
  })
  actionsBox.appendChild(removeButton)

  // Finally add to the DOM
  container.appendChild(mainDiv)

  return Promise.resolve(true)
}

/**
 * Create a new task
 * @param {number} id - The task identifier
 * @param {string} content - The content of the task
 * @param {boolean} status - True to set as completed
 * @param {number} insertPosition - position in the tasks array at which to insert the newly created task
 */
TasksListView.prototype.createTask = function (id, content, status, insertPosition = -1) {
  let task = document.createElement('li')
  task.className = 'task'
  task.id = `task-${id}`
  task.dataset.id = id
  task.addEventListener('click', ({currentTarget: ct}) => {
    // use e.currentTarget to be sure to use the attached node instead of e.target which can be some child
    // use e.currentTarget when in lexical mode (arrow function), or this in normal function(event) mode
    const checkbox = ct.firstChild
    const id = ct.dataset.id
    const content = ct.children[1].value
    const newChecked = !JSON.parse(checkbox.dataset.checked) // /!\ data-* value is always a string
    // console.log('Event triggered @ TaskListView createTask: newChecked', checkbox)
    this.model.updateTask(id, content, newChecked)
  })

  let statusCheckbox = document.createElement('div')
  statusCheckbox.className = 'statusCheckbox'
  statusCheckbox.dataset.checked = status
  // TODO: use 'done_all' to check/uncheck all tasks at once
  statusCheckbox.innerHTML = '<i class="material-icons">done</i>'
  if (!status) statusCheckbox.classList.add('hideCheckbox')
  /* ou
   `<i class='material-icons'>
      ${status ? 'check_box' : 'check_box_outline_blank'}
    </i>` */
  task.appendChild(statusCheckbox)

  let contentInput = document.createElement('input')
  contentInput.maxLength = 250
  contentInput.dataset.currentContent = content
  contentInput.dataset.cancel = false
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
  // Save previous value before user actually edit the value
  contentInput.addEventListener('focus', function () {
    const isEditing = !this.readOnly
    if (isEditing) {
      this.dataset.currentContent = this.value
      this.classList.remove('strike')
    }
  })
  contentInput.addEventListener('blur', ({currentTarget: ct}) => {
    ct.readOnly = true
    const task = ct.parentElement
    const currentContent = ct.dataset.currentContent
    const checkbox = task.firstChild
    const id = task.dataset.id
    const newContent = ct.value
    const checked = JSON.parse(checkbox.dataset.checked) // /!\ data-* value is always a string
    if (checked) ct.classList.add('strike')
    // Prevent useless server call and overwrite value with old value
    if (JSON.parse(ct.dataset.cancel)) {
      ct.value = currentContent
      ct.dataset.cancel = false
      return
    }
    // Prevent useless server call
    if (newContent !== currentContent) {
      // console.log('Event triggered @ TaskListView createTask: newContent', newContent)
      this.model.updateTask(id, newContent, checked)
    }
  })
  contentInput.addEventListener('keyup', function (event) {
    switch (event.key) {
      case 'Esc': // 'Escape' not recognised in Edge
      case 'Escape':
        this.dataset.cancel = true
      // eslint-disable-next-line no-fallthrough
      case 'Enter':
        this.blur() // Triggers indirectly the contentInput blur event defined above
        break
      default: break
    }
  })
  task.appendChild(contentInput)

  task.addEventListener('mouseenter', event => {
    this.taskActions.style.display = 'flex'
    // single line task height = 38px - actionsBox height 26px = 12px /2 = 6px margin-top
    this.taskActions.style.top = (event.currentTarget.offsetTop + 6) + 'px'
    this.currentTask = event.currentTarget
  })

  if (insertPosition !== -1) {
    const element = this.taskContainer.children[insertPosition]
    this.taskContainer.insertBefore(task, element)
  } // eslint-disable-line brace-style
  else this.taskContainer.appendChild(task)
}

/**
 * Update a task
 * @param {number} id - The task identifier
 * @param {string} content - Task content
 * @param {string} finished_at - Completion date
 */
TasksListView.prototype.updateTask = function (id, content, finished_at) {
  let task = document.getElementById(`task-${id}`)
  if (!task) return
  const statusCheckbox = task.firstChild
  const contentInput = task.children[1]
  const status = (finished_at !== null)
  statusCheckbox.dataset.checked = status
  if (status) {
    statusCheckbox.classList.remove('hideCheckbox')
    contentInput.classList.add('strike')
  } else {
    statusCheckbox.classList.add('hideCheckbox')
    contentInput.classList.remove('strike')
  }
  contentInput.value = content
}

/**
 * Remove a task
 * @param {number} id - The task identifier
 */
TasksListView.prototype.removeTask = function (id) {
  const task = document.getElementById(`task-${id}`)
  if (!task) return

  this.taskContainer.removeChild(task)
}

/**
 * Update completion indicator
 * @param {number} taskRemainingCount - Amount of uncompleted task(s)
 * @param {number} taskCount - Task count
 */
TasksListView.prototype.updateCompletion = function (taskRemainingCount, taskCount) {
  this.completionContainer.innerHTML = `${taskRemainingCount} / ${taskCount}`
  if (Number.isFinite(taskCount)) this.completionContainer.title = // eslint-disable-line curly
    `Remaining tasks
(completion ${(((taskCount - taskRemainingCount) / taskCount) * 100).toFixed(1)} %)`
}
