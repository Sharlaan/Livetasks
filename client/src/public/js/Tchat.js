'use strict'
/* eslint-disable camelcase */
/**
 * List of Messages constructor
 * @param {number} groupId - Group identifier
 * @param {Socket} socket - socket instance used for communicating with the API
 */
function Tchat (groupId, socket) {
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
   * @type {string}
   */
  this.pseudo = null

  /**
   * Messages
   * @type {Array.<Object>}
   */
  this.messages = []

  /**
   * The view
   * @type {TchatView}
   */
  this.view = new TchatView(this) // eslint-disable-line no-undef
}

/**
 * Init: synchronously create the view container, then load messages inside
 * @param {DomElement} container - Group's container created by <Groups>
 */
Tchat.prototype.init = function (container) {
  this.view.create(container)
    .then(() => this.checkPseudo())
    .then(() => this.load())

  // Initialize broadcasted event listeners
  this.socket.on('onMessageCreated', data => {
    console.warn('Received broadcasted event onMessageCreated\n', data)
    this.onMessageSent(data)
  })
  this.socket.on('onMessageUpdated', data => {
    console.warn('Received broadcasted event onMessageUpdated\n', data)
    this.onMessageUpdated(data)
  })
  this.socket.on('onMessageRemoved', data => {
    console.warn('Received broadcasted event onMessageRemoved\n', data)
    this.onMessageRemoved(data.id)
  })
}

Tchat.prototype.checkPseudo = function () {
  return new Promise((resolve, reject) => {
    this.socket.emit(
      'registerUser',
      prompt('Type a pseudo to identify you in app\'s tchats:'), // eslint-disable-line no-undef
      pseudo => {
        if (!pseudo) reject(new Error('Your pseudo did not register properly.'))
        const appHeader = document.querySelector('body > header')
        const pseudoDisplay = document.createElement('span')
        pseudoDisplay.textContent = `Welcome ${pseudo} !`
        appHeader.appendChild(pseudoDisplay)
        this.pseudo = pseudo
        resolve(true)
      }
    )
  })
}

/**
 * Load messages from database
 */
Tchat.prototype.load = function () {
  this.socket.emit(
    'getAllMessages',
    null,
    ({status, message, data: messages}) => {
      if (status === 'failed') return console.error('Error with getAllMessages fetch\n', message)
      // Load messages
      this.messages = messages
      // Create views
      for (let { id, sender, content, created_at } of messages) {
        this.view.createMessage(id, sender, content, created_at)
      }
    }
  )
}

/**
 * Send a new message
 * @param {string} content - The content of the message
 */
Tchat.prototype.sendMessage = async function (content) {
  this.socket.emit(
    'sendMessage',
    JSON.stringify({ groupId: this.groupId, sender: this.pseudo, content }),
    ({status, message, data}) => {
      if (status === 'failed') return console.error('Error with sendMessage fetch\n', message)
      console.log('sendMessage data', data)
      // Add to the DOM
      this.onMessageSent(data)
    }
  )
}

/**
 * Update a message
 * @param {number} id - Message identifier
 * @param {string} content - The content of the message
 */
Tchat.prototype.updateMessage = function (id, content) {
  // console.log('Tchat updateMessage: Asking server for update (+ broadcast if successful)', {id, content})
  this.socket.emit(
    'updateMessage',
    JSON.stringify({ id, content }),
    ({status, message, data}) => {
      if (status === 'failed') return console.error('Error with updateMessage fetch\n', message)
      // console.log('Server answered @ Tchat updateMessage:', data)
      this.onMessageUpdated(data) // Update the DOM element and its model
    }
  )
}

/**
 * Remove a given message
 * @param {number} id - Message identifier
 */
Tchat.prototype.removeMessage = function (id) {
  this.socket.emit(
    'removeMessage',
    JSON.stringify({ groupId: this.groupId, id }),
    ({status, message}) => {
      if (status === 'failed') return console.error('Error with removeMessage fetch\n', message)
      // console.log'removeMessage data', data)
      this.onMessageRemoved(id) // Remove from the DOM
    }
  )
}

/**
 * Call when a message is created
 * @param {number} id - Message identifier
 * @param {string} sender - Name of message's author
 * @param {string} content - The content of the message
 * @param {Date} created_at - Date of creation
 */
Tchat.prototype.onMessageSent = function ({ id, sender, content, created_at }) {
  this.messages.push({ id, sender, content, created_at, deleted_at: null })
  this.view.createMessage(id, sender, content, created_at)
}

/**
 * Call when a message is updated
 * @param {number} id Message - identifier
 * @param {string} content - Message content
 */
Tchat.prototype.onMessageUpdated = function ({ id, content }) {
  // console.log'onMessageUpdated\ncontent', content)
  // Update model
  const message = this.messages.find(message => message.id === id)
  if (message) {
    message.content = content
  }

  // Update view
  this.view.updateMessage(id, content)
}

/**
 * Call when a message is removed
 * @param {number} id - Message identifier
 */
Tchat.prototype.onMessageRemoved = function (id) {
  // Remove model
  const index = this.messages.findIndex(message => message.id === +id)
  if (index !== -1) this.messages.splice(index, 1)

  // Update view
  this.view.removeMessage(id)
}
