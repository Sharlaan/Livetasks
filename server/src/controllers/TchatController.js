/* eslint-disable standard/no-callback-literal */
import Message from '../models/Message'
import { tchat as tchatMessages } from '../config/translations'

const {
  MESSAGE_ALL_SUCCESS,
  MESSAGE_ALL_ERROR,
  MESSAGE_CREATE_INVALID_PARAM,
  MESSAGE_CREATE_SUCCESS,
  MESSAGE_CREATE_ERROR,
  MESSAGE_UPDATE_INVALID_PARAM,
  MESSAGE_UPDATE_SUCCESS,
  MESSAGE_UPDATE_ERROR,
  MESSAGE_REMOVE_INVALID_PARAM,
  MESSAGE_REMOVE_SUCCESS,
  MESSAGE_REMOVE_ERROR
} = tchatMessages

export default {
  /**
   * Retrieve all messages
   * @param {null} data - received from client
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async all (data, response) {
    try {
      const data = await Message.getAll()
      response({
        status: 'success',
        data,
        message: MESSAGE_ALL_SUCCESS
      })
    } catch (error) {
      console.log('Error @ TchatController.all:\n', error)
      response({
        status: 'failed',
        message: MESSAGE_ALL_ERROR
      })
    }
  },

  /**
   * Create a new message
   * @param {string} data - stringified object from client
   * @param {number} data.groupId - newMessage's group ID
   * @param {string} data.sender - newMessage's sender
   * @param {string} data.content - newMessage's content
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async create (data, response) {
    const {groupId, sender, content} = JSON.parse(data)
    if (!/^\d+$/.test(groupId) || typeof sender !== 'string' || typeof content !== 'string') {
      return response({
        status: 'failed',
        message: MESSAGE_CREATE_INVALID_PARAM
      })
    }
    try {
      const newMessage = await Message.create(groupId, sender, content)
      if (newMessage) {
        // Notify other clients
        this.broadcast.emit('onMessageCreated', newMessage)
        // respond to client
        response({
          status: 'success',
          data: newMessage,
          message: MESSAGE_CREATE_SUCCESS
        })
      }
    } catch (error) {
      console.log('Error @ TchatController.create:\n', error)
      response({
        status: 'failed',
        message: MESSAGE_CREATE_ERROR
      })
    }
  },

  /**
   * Update a specified message
   * @param {string} data - stringified object from client
   * @param {number} data.id - message ID
   * @param {string} data.content - Message content
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async update (data, response) {
    const { id, content } = JSON.parse(data)
    if (!/^\d+$/.test(id) || typeof content !== 'string') {
      return response({
        status: 'failed',
        message: MESSAGE_UPDATE_INVALID_PARAM
      })
    }
    try {
      const updatedMessage = await Message.update(+id, content)
      // Notify other clients
      this.broadcast.emit('onMessageUpdated', updatedMessage)
      // respond to client
      response({
        status: 'success',
        data: updatedMessage,
        message: MESSAGE_UPDATE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ TchatController.update:\n', error)
      response({
        status: 'failed',
        message: MESSAGE_UPDATE_ERROR
      })
    }
  },

  /**
   * Remove the specified message
   * @param {string} data - stringified object from client
   * @param {number} data.id - Message ID
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async remove (data, response) {
    const { groupId, id } = JSON.parse(data)
    if (!/^\d+$/.test(id)) {
      return response({
        status: 'failed',
        message: MESSAGE_REMOVE_INVALID_PARAM
      })
    }
    try {
      await Message.remove(id)
      // Notify other clients
      this.broadcast.emit('onMessageRemoved', { groupId, id })
      // respond to client
      response({
        status: 'success',
        message: MESSAGE_REMOVE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ TchatController.remove:\n', error)
      response({
        status: 'failed',
        message: MESSAGE_REMOVE_ERROR
      })
    }
  }
}
