/* eslint-disable standard/no-callback-literal */
import Task from '../models/Task'
import { tasks as tasksMessages } from '../config/translations'

const {
  TASK_ALL_SUCCESS,
  TASK_ALL_ERROR,
  TASK_CREATE_INVALID_PARAM,
  TASK_CREATE_SUCCESS,
  TASK_CREATE_ERROR,
  TASK_UPDATE_INVALID_PARAM,
  TASK_UPDATE_SUCCESS,
  TASK_UPDATE_ERROR,
  TASK_REMOVE_INVALID_PARAM,
  TASK_REMOVE_SUCCESS,
  TASK_REMOVE_ERROR
} = tasksMessages

export default {
  /**
   * Retrieve all tasks
   * @param {null} data - received from client
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {JSON} response
   */
  async all (data, response) {
    try {
      const data = await Task.getAll()
      response({
        status: 'success',
        data,
        message: TASK_ALL_SUCCESS
      })
    } catch (error) {
      console.log('Error @ TasksController.all:\n', error)
      response({
        status: 'failed',
        message: TASK_ALL_ERROR
      })
    }
  },

  /**
   * Create a new task
   * @param {string} data - stringified object from client
   * @param {number} data.groupId - newTask's group ID
   * @param {string} data.content - newTask's content
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async create (data, response) {
    const { groupId, content } = JSON.parse(data)
    if (!/^\d+$/.test(groupId) || typeof content !== 'string') {
      return response({
        status: 'failed',
        message: TASK_CREATE_INVALID_PARAM
      })
    }
    try {
      const newTask = await Task.create(groupId, content)
      if (newTask) {
        // Notify other clients
        this.broadcast.emit('onTaskCreated', newTask)
        // respond to client
        response({
          status: 'success',
          data: newTask,
          message: TASK_CREATE_SUCCESS
        })
      }
    } catch (error) {
      console.log('Error @ TasksController.create:\n', error)
      response({
        status: 'failed',
        message: TASK_CREATE_ERROR
      })
    }
  },

  /**
   * Update a specified task
   * @param {string} data - stringified object from client
   * @param {number} data.id - task ID
   * @param {string} data.content - Task content
   * @param {boolean} data.finished - Task status
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async update (data, response) {
    const { id, content, finished } = JSON.parse(data)
    if (
      !/^\d+$/.test(id) ||
      typeof content !== 'string' ||
      typeof finished !== 'boolean'
    ) {
      return response({
        status: 'failed',
        message: TASK_UPDATE_INVALID_PARAM
      })
    }
    try {
      const updatedTask = await Task.update(+id, content, finished)
      // Notify other clients
      this.broadcast.emit('onTaskUpdated', updatedTask)
      // respond to client
      response({
        status: 'success',
        data: updatedTask,
        message: TASK_UPDATE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ TasksController.update:\n', error)
      response({
        status: 'failed',
        message: TASK_UPDATE_ERROR
      })
    }
  },

  /**
   * Remove the specified task
   * @param {string} data - stringified object from client
   * @param {number} data.id - Task ID
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async remove (data, response) {
    const { groupId, id } = JSON.parse(data)
    if (!/^\d+$/.test(id) || !/^\d+$/.test(id)) {
      return response({
        status: 'failed',
        message: TASK_REMOVE_INVALID_PARAM
      })
    }
    try {
      await Task.remove(id)
      // Notify other clients
      this.broadcast.emit('onTaskRemoved', { groupId, id })
      // respond to client
      response({
        status: 'success',
        message: TASK_REMOVE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ TasksController.remove:\n', error)
      response({
        status: 'failed',
        message: TASK_REMOVE_ERROR
      })
    }
  }
}
