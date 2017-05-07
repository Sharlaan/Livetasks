/* eslint-disable camelcase */
import db from '../config/database/database'
import { tasksQueries } from '../config/database/sqlQueries/index'

// TODO: make db settable, so can use Tasks' methods with either testdb or db
export default class Task {
  /**
   * Retrieve all tasks
   * @return {Promise} promise
   */
  static getAll () {
    return db.any(tasksQueries.getAll.query)
  }

  /**
   * Retrieve one particular task
   * @return {Promise} promise
   */
  static get (id) {
    return db.one(tasksQueries.get.query, [id])
  }

  /**
   * Create a new task
   * @param {number} group_id ID of the group the task belongs to
   * @param {string} content Task's content
   * @return {Promise} promise (id, group_id, content, created_at)
   */
  static create (group_id, content) {
    return db.one(tasksQueries.create.query, [group_id, content])
  }

  /**
   * Update task with the given identifier
   * @param {number} id Unique identifier
   * @param {string} content Name
   * @param {boolean} status True to set as finished, otherwise false
   * @return {Promise} promise (id, group_id, content, created_at, finished_at)
   */
  static update (id, content, status) {
    return db.one(tasksQueries.update.query, [id, content, status])
  }

  /**
   * Remove the specified task
   * @param {number} id Task identifier
   * @return {Promise} promise
   */
  static remove (id) {
    return db.none(tasksQueries.remove.query, [id])
  }
}
