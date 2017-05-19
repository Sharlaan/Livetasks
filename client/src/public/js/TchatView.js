'use strict'
/* eslint-disable camelcase */
/**
 * Constructor
 * @param {Tchat} model - Linked model
 */
function TchatView (model) {
  /**
   * Linked model
   * @type {Tchat}
   */
  this.model = model

  // TODO: implement unread messages counter

  /**
   * Message container
   * @type {DOMElement}
   */
  this.messageContainer = null
}

/**
 * Create a new group of messages
 * @param {DOMElement} container - Parent element
 * @return {promise} Resolved Promise if everything was successful
 */
TchatView.prototype.create = function (container) {
  let mainDiv = document.createElement('div')
  mainDiv.className = 'tchat-container'

  // Header
  const headerDiv = document.createElement('header')
  headerDiv.className = 'tchat-header'

  let tchatTitle = document.createElement('h3')
  tchatTitle.textContent = 'Tchat'
  headerDiv.appendChild(tchatTitle)
  mainDiv.appendChild(headerDiv)

  // Messages
  const messageList = document.createElement('ul')
  messageList.className = 'message-list'
  mainDiv.appendChild(messageList)
  this.messageContainer = messageList

  // Footer Input
  const footerDiv = document.createElement('footer')
  footerDiv.className = 'tchat-footer'
  const messageField = document.createElement('p')
  messageField.className = 'message-field'
  messageField.setAttribute('contenteditable', 'true')
  const placeholder = 'Type some message ...'
  messageField.textContent = placeholder
  messageField.addEventListener('focus', function () {
    if (this.textContent === placeholder) this.textContent = ''
  })
  messageField.addEventListener('blur', function () {
    this.textContent = placeholder
  })
  // TODO: test on tablet
  messageField.addEventListener('keyup', ({ key, shiftKey, currentTarget }) => {
    if (key === 'Esc' || key === 'Escape') return currentTarget.blur()
    if (key === 'Enter') {
      let newContent = currentTarget.innerText // preserves linebreaks unlike textContent
      if (shiftKey) {
        // +20px/newLine + 1px interline
        // currentTarget.parentElement.style.minHeight = (currentTarget.scrollHeight + 21) + 'px'
        return
      }
      if (newContent !== '' && newContent !== placeholder) {
        const trimmedContent = newContent.split('\n').filter(v => v.length).join('\n')
        this.model.sendMessage(trimmedContent)
        currentTarget.textContent = placeholder
        // currentTarget.parentElement.style.minHeight = '42px'
      }
    }
  })
  footerDiv.appendChild(messageField)
  const sendButton = document.createElement('button')
  sendButton.className = 'send-button'
  sendButton.innerHTML = '<i class="material-icons">send</i>'
  sendButton.title = 'Send message'
  sendButton.addEventListener('click', event => {
    const messageField = event.currentTarget.parentElement.parentElement.getElementsByClassName('message-field')[0]
    const newContent = messageField.innerText
    if (newContent !== '' && newContent !== placeholder) {
      const trimmedContent = newContent.split('\n').filter(v => v.length).join('\n')
      this.model.sendMessage(trimmedContent)
      messageField.textContent = placeholder
    }
  })
  const buttonsContainer = document.createElement('div')
  buttonsContainer.className = 'buttons-container'
  buttonsContainer.appendChild(sendButton)
  footerDiv.appendChild(buttonsContainer)

  mainDiv.appendChild(footerDiv)

  // Finally add to the DOM
  container.appendChild(mainDiv)

  return Promise.resolve(true)
}

/**
 * Create a new message
 * @param {number} id - The message identifier
 * @param {string} sender - Name of the message's author
 * @param {string} content - The content of the message
 * @param {string} created_at - Message's creation date
 */
TchatView.prototype.createMessage = function (id, sender, content, created_at) {
  let message = document.createElement('li')
  message.className = 'message'
  if (sender === this.model.pseudo) message.style.flexDirection = 'row-reverse'
  message.id = `message-${id}`
  message.dataset.id = id

  let senderDisplay = document.createElement('div')
  senderDisplay.className = 'senderDisplay'
  senderDisplay.textContent = sender
  message.appendChild(senderDisplay)

  let messageContent = document.createElement('div')
  messageContent.dataset.currentContent = content
  messageContent.innerText = content
  messageContent.className = sender === this.model.pseudo
    ? 'messageOwnContent'
    : 'messageContent'
  let postDate = document.createElement('div')
  postDate.textContent = moment(created_at, null, 'en').fromNow() // eslint-disable-line no-undef
  postDate.className = 'postDate'
  messageContent.appendChild(postDate)
  message.appendChild(messageContent)

  this.messageContainer.appendChild(message)
  this.messageContainer.scrollTop = this.messageContainer.scrollHeight
}

/**
 * Update a message
 * @param {number} id - The message identifier
 * @param {string} content - Message content
 */
TchatView.prototype.updateMessage = function (id, content) {
  let message = document.getElementById(`message-${id}`)
  if (!message) return
  const contentInput = message.children[1]
  contentInput.value = content
}

/**
 * Remove a message
 * @param {number} id - The message identifier
 */
TchatView.prototype.removeMessage = function (id) {
  const message = document.getElementById(`message-${id}`)
  if (!message) return

  this.messageContainer.removeChild(message)
}
