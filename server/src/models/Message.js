/* eslint-disable camelcase */
import db from '../config/database/database'
import { messagesQueries } from '../config/database/sqlQueries/index'

// TODO: make db settable, so can use Messages' methods with either testdb or db
export default class Message {
  /**
   * Retrieve all messages
   * @return {Promise} promise
   */
  static getAll () {
    return db.any(messagesQueries.getAll.query)
  }

  /**
   * Retrieve one particular message
   * @return {Promise} promise
   */
  static get (id) {
    return db.one(messagesQueries.get.query, [id])
  }

  /**
   * Create a new message
   * @param {number} group_id - ID of the group the message belongs to
   * @param {string} sender - Sender's name
   * @param {string} content - Message's content
   * @return {Promise} promise (id, group_id, sender, content, created_at)
   */
  static create (group_id, sender, content) {
    return db.one(messagesQueries.create.query, [group_id, sender, content])
  }

  /**
   * Update message with the given identifier
   * @param {number} id - Unique identifier
   * @param {string} content - Name
   * @return {Promise} promise (id, group_id, sender, content, created_at)
   */
  static update (id, content) {
    return db.one(messagesQueries.update.query, [id, content])
  }

  /**
   * Remove the specified message
   * @param {number} id - Message identifier
   * @return {Promise} promise
   */
  static remove (id) {
    return db.none(messagesQueries.remove.query, [id])
  }
}
