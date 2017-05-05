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

class TasksController {
  /**
   * Retrieve getAll tasks
   * @param {HTTPRequest} request object
   * @param {HTTPResponse} response object
   * @return {string} JSON formatted string
   */
  async all (request, response, next) {
    try {
      const data = await Task.getAll()
      response.status(200).json({
        status: 'success',
        data,
        message: TASK_ALL_SUCCESS
      })
      next()
    } catch (error) {
      console.log('Error @ TasksController.all:\n', error)
      response.status(500).json({
        status: 'failed',
        message: TASK_ALL_ERROR
      })
    }
  }

  /**
   * Create a new task
   * @param {HTTPRequest} request object
   * @param {HTTPResponse} response object
   * @return {string} JSON formatted string
   */
  async create (request, response, next) {
    const { content } = request.body
    if (typeof content !== 'string') {
      response.status(500).json({
        status: 'failed',
        message: TASK_CREATE_INVALID_PARAM
      })
      return false
    }
    try {
      const createdTask = await Task.create(content)
      if (createdTask) {
        // respond to client
        response.status(201).json({
          status: 'success',
          data: createdTask,
          message: TASK_CREATE_SUCCESS
        })
        // Notify other clients by calling PushNotifier with
        // createdTask passed via response object
        response.locals.createdTask = createdTask
        next() // calls next middleware
      }
    } catch (error) {
      console.log('Error @ TasksController.create:\n', error)
      response.status(500).json({
        status: 'failed',
        message: TASK_CREATE_ERROR
      })
    }
  }

  /**
   * Update a specified task
   * @param {HTTPRequest} request object
   * @param {HTTPResponse} response object
   * @return {string} JSON formatted string
   */
  async update (request, response, next) {
    const { id, content, finished } = request.body
    if (!/^\d+$/.test(id) ||
      typeof content !== 'string' ||
      typeof finished !== 'boolean'
    ) {
      response.status(500).json({
        status: 'failed',
        message: TASK_UPDATE_INVALID_PARAM
      })
      return false
    }
    try {
      const updatedTask = await Task.update(+id, content, finished)
      if (updatedTask) {
        response.status(200).json({
          status: 'success',
          data: updatedTask,
          message: TASK_UPDATE_SUCCESS
        })
        // Notify other clients by calling PushNotifier with
        // updatedTask passed via response object
        response.locals.updatedTask = updatedTask
        next() // calls next middleware
      }
    } catch (error) {
      console.log('Error @ TasksController.update:\n', error)
      response.status(500).json({
        status: 'failed',
        message: TASK_UPDATE_ERROR
      })
    }
  }

  /**
   * Remove the specified task
   * @param {HTTPRequest} request object
   * @param {HTTPResponse} response object
   * @return {string} JSON formatted string
   */
  async remove (request, response, next) {
    const { id } = request.body
    if (!/^\d+$/.test(id)) {
      response.status(500).json({
        status: 'failed',
        message: TASK_REMOVE_INVALID_PARAM
      })
      return false
    }
    try {
      await Task.remove(id)
      response.status(200).json({
        status: 'success',
        message: TASK_REMOVE_SUCCESS
      })
      // Notify other clients by calling PushNotifier with
      // removed task's id passed via response object
      response.locals.id = id
      next()
    } catch (error) {
      console.log('Error @ TasksController.remove:\n', error)
      response.status(500).json({
        status: 'failed',
        message: TASK_REMOVE_ERROR
      })
    }
  }
}

export default new TasksController()
