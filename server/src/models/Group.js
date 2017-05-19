/* eslint-disable camelcase */
import db from '../config/database/database'
import { groupsQueries } from '../config/database/sqlQueries/index'

// TODO: make db settable, so can use Groups' methods with either testdb or db
export default class Group {
  /**
   * Retrieve all groups
   * @return {Promise} promise
   */
  static getAll () {
    return db.any(groupsQueries.getAll.query)
  }

  /**
   * Retrieve one particular group
   * @return {Promise} promise returning {id, name}
   */
  static get (id) {
    return db.one(groupsQueries.get.query, [id])
  }

  /**
   * Create a new group
   * @param {string} name - Group's name
   * @return {Promise} promise (id, name, created_at)
   */
  static create (name) {
    return db.one(groupsQueries.create.query, [name])
  }

  /**
   * Update group with the given identifier
   * @param {number} id - Unique identifier
   * @param {string} name - Name
   * @return {Promise} promise (id, name, created_at)
   */
  static update (id, name) {
    return db.one(groupsQueries.update.query, [id, name])
  }

  /**
   * Remove the specified group
   * @param {number} id - Group identifier
   * @return {Promise} promise
   */
  static remove (id) {
    return db.none(groupsQueries.remove.query, [id])
  }
}
