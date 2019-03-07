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
  const tchatTitle = createElement('h3', { textContent: 'Tchat' })

  const headerDiv = createElement(
    'header',
    { className: 'tchat-header' },
    tchatTitle
  )

  // Messages
  const messageList = createElement('ul', { className: 'message-list' })
  this.messageContainer = messageList

  // Footer Input
  const placeholder = 'Type some message ...'
  const messageField = createElement('p', {
    className: 'message-field',
    textContent: placeholder,
    setAttribute: [['contenteditable', 'true']],
    addEventListener: [
      [
        'focus',
        function () {
          if (this.textContent === placeholder) this.textContent = ''
        }
      ],
      [
        'blur',
        function () {
          if (!this.textContent) this.textContent = placeholder
        }
      ],
      [
        'keyup',
        ({ key, shiftKey, currentTarget }) => {
          switch (key) {
            case 'Esc':
            case 'Escape':
              currentTarget.textContent = ''
              currentTarget.blur()
              break

            case 'Enter':
              if (shiftKey) break // SHIFT + Enter = linebreak
              passMessage2Model(
                currentTarget,
                placeholder,
                this.model.sendMessage.bind(this.model)
              )
              currentTarget.textContent = ''
              break

            default:
              break
          }
        }
      ]
    ]
  })
  // TODO: test on tablet
  const sendButton = createElement('button', {
    className: 'send-button',
    innerHTML: '<i class="material-icons">send</i>',
    title: 'Send message',
    addEventListener: [
      [
        'click',
        (event) => {
          const field = event.currentTarget.parentElement.parentElement.getElementsByClassName(
            'message-field'
          )[0]
          passMessage2Model(
            field,
            placeholder,
            this.model.sendMessage.bind(this.model)
          )
          messageField.textContent = placeholder
        }
      ]
    ]
  })

  const buttonsContainer = createElement(
    'div',
    { className: 'buttons-container' },
    sendButton
  )

  const footerDiv = createElement(
    'footer',
    { className: 'tchat-footer' },
    messageField,
    buttonsContainer
  )

  const mainDiv = createElement(
    'div',
    { className: 'tchat-container' },
    headerDiv,
    messageList,
    footerDiv
  )

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
  const senderDisplay = createElement('div', {
    className: 'senderDisplay',
    textContent: sender
  })

  const postDate = createElement('div', {
    textContent: moment(created_at, null, 'en').fromNow(), // eslint-disable-line no-undef
    className: 'postDate'
  })

  const messageContent = createElement(
    'div',
    {
      dataset: { currentContent: content },
      innerText: content,
      className:
        sender === this.model.pseudo ? 'messageOwnContent' : 'messageContent'
    },
    postDate
  )

  const message = createElement(
    'li',
    {
      id: `message-${id}`,
      dataset: { id },
      className: 'message',
      classList: {
        add: sender === this.model.pseudo ? ['reverseFlexDirection'] : null
      }
    },
    senderDisplay,
    messageContent
  )

  this.messageContainer.appendChild(message)
  // Scroll to most recent message
  this.messageContainer.scrollTop = this.messageContainer.scrollHeight
}

/**
 * Update a message
 * @param {number} id - The message identifier
 * @param {string} content - Message content
 */
TchatView.prototype.updateMessage = function (id, content) {
  const message = document.getElementById(`message-${id}`)
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

/**
 * Helper function for reusability across keystroke events
 *
 * @param {DomElement} field - element in which message is typed
 * @param {string} placeholder - optional placeholder text to compare
 *                               to prevent unnecessary server request
 * @param {function} sendMessage - model's function
 * /!\ IMPORTANT: when passing a method reference as callback, the 'this' context is lost !
 * Here the reference is tied to this.model, so have to bind to it to preserve the this context
 * when the callback will use it.
 * https://stackoverflow.com/questions/15048775/how-to-get-callback-to-work-with-this-in-class-scope/15048802#15048802
 */
function passMessage2Model (field, placeholder = '', sendMessage) {
  const newContent = field.innerText // preserves linebreaks unlike textContent
  if (newContent !== '' && newContent !== placeholder) {
    // Remove additional unnecessary linebreaks at the end of new content
    const trimmedContent = newContent
      .split('\n')
      .filter((v) => v.length)
      .join('\n')
    sendMessage(trimmedContent)
  }
}
