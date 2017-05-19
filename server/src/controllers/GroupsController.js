import Group from '../models/Group'
import { groups as groupsMessages } from '../config/translations'

const {
  GROUP_ALL_SUCCESS,
  GROUP_ALL_ERROR,
  GROUP_JOIN_INVALID_PARAM,
  GROUP_JOIN_SUCCESS,
  GROUP_JOIN_ERROR,
  GROUP_LEAVE_INVALID_PARAM,
  GROUP_LEAVE_SUCCESS,
  GROUP_LEAVE_ERROR,
  GROUP_CREATE_INVALID_PARAM,
  GROUP_CREATE_SUCCESS,
  GROUP_CREATE_ERROR,
  GROUP_UPDATE_INVALID_PARAM,
  GROUP_UPDATE_SUCCESS,
  GROUP_UPDATE_ERROR,
  GROUP_REMOVE_INVALID_PARAM,
  GROUP_REMOVE_SUCCESS,
  GROUP_REMOVE_ERROR
} = groupsMessages

// noinspection JSAnnotator
export default {
  /**
   * Retrieve all groups
   * @param {null} data - received from client
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async all (data, response) {
    try {
      const data = await Group.getAll()
      response({
        status: 'success',
        data,
        message: GROUP_ALL_SUCCESS
      })
    } catch (error) {
      console.log('Error @ GroupsController.all:\n', error)
      response({
        status: 'failed',
        message: GROUP_ALL_ERROR
      })
    }
  },

  /**
   * Check if queried group to join exists, then join (or not)
   * @param {number} data - queried group's id received from client
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async joinGroup (data, response) {
    const groupId = JSON.parse(data)
    if (!/^\d+$/.test(groupId)) {
      return response({
        status: 'failed',
        message: GROUP_JOIN_INVALID_PARAM
      })
    }
    try {
      const group = await Group.get(groupId)
      // Check if current socket is already in another group, if yes then leave it
      if (this.group) this.leave(this.group.name)
      this.group = group
      this.join(group.name)
      this.broadcast.to(group.name).emit(`${this.pseudo} joined group ${this.group.name}`)
      response({
        status: 'success',
        data: group,
        message: GROUP_JOIN_SUCCESS
      })
    } catch (error) {
      console.log('Error @ GroupsController.joinGroup:\n', error)
      response({
        status: 'failed',
        message: GROUP_JOIN_ERROR
      })
    }
  },

  /**
   * Check if queried group to leave exists, then leave it
   * @param {number} data - queried group's id received from client
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async leaveGroup (data, response) {
    const groupId = JSON.parse(data)
    if (!/^\d+$/.test(groupId)) {
      return response({
        status: 'failed',
        message: GROUP_LEAVE_INVALID_PARAM
      })
    }
    try {
      const group = await Group.get(groupId)
      this.group = null
      this.leave(group.name)
      this.broadcast.to(group.name).emit(`${this.pseudo} left group ${group.name}`)
      response({
        status: 'success',
        data: group,
        message: GROUP_LEAVE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ GroupsController.leaveGroup:\n', error)
      response({
        status: 'failed',
        message: GROUP_LEAVE_ERROR
      })
    }
  },

  /**
   * Create a new task
   * @param {string} data - stringified object from client
   * @param {number} data.groupId - newGroup's group ID
   * @param {string} data.name - newGroup's name
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async create (data, response) {
    const {name} = JSON.parse(data)
    if (typeof name !== 'string') {
      return response({
        status: 'failed',
        message: GROUP_CREATE_INVALID_PARAM
      })
    }
    try {
      const newGroup = await Group.create(name)
      if (newGroup) {
        // Notify other clients
        this.broadcast.emit('onGroupCreated', newGroup)
        // respond to client
        response({
          status: 'success',
          data: newGroup,
          message: GROUP_CREATE_SUCCESS
        })
      }
    } catch (error) {
      console.log('Error @ GroupsController.create:\n', error)
      response({
        status: 'failed',
        message: GROUP_CREATE_ERROR
      })
    }
  },

  /**
   * Update a specified group
   * @param {string} data - stringified object from client
   * @param {number} data.id - task ID
   * @param {string} data.name - Group name
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async update (data, response) {
    const { id, name } = JSON.parse(data)
    if (!/^\d+$/.test(id) ||
      typeof name !== 'string'
    ) {
      return response({
        status: 'failed',
        message: GROUP_UPDATE_INVALID_PARAM
      })
    }
    try {
      const updatedGroup = await Group.update(+id, name)
      // Notify other clients
      this.broadcast.to(this.group).emit('onGroupUpdated', updatedGroup)
      // respond to client
      response({
        status: 'success',
        data: updatedGroup,
        message: GROUP_UPDATE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ GroupsController.update:\n', error)
      response({
        status: 'failed',
        message: GROUP_UPDATE_ERROR
      })
    }
  },

  /**
   * Remove the specified task
   * @param {string} data - stringified object from client
   * @param {number} data.id - Group ID
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  async remove (data, response) {
    const { groupId, id } = JSON.parse(data)
    if (!/^\d+$/.test(id) || !/^\d+$/.test(id)) {
      return response({
        status: 'failed',
        message: GROUP_REMOVE_INVALID_PARAM
      })
    }
    try {
      await Group.remove(id)
      // Notify other clients
      this.broadcast.emit('onGroupRemoved', { groupId, id })
      // respond to client
      response({
        status: 'success',
        message: GROUP_REMOVE_SUCCESS
      })
    } catch (error) {
      console.log('Error @ GroupsController.remove:\n', error)
      response({
        status: 'failed',
        message: GROUP_REMOVE_ERROR
      })
    }
  }
}
