'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _database = require('../config/database/database');

var _database2 = _interopRequireDefault(_database);

var _index = require('../config/database/sqlQueries/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: make db settable, so can use Tasks' methods with either testdb or db
/* eslint-disable camelcase */
class Task {
  /**
   * Retrieve all tasks
   * @return {Promise} promise
   */
  static getAll() {
    return _database2.default.any(_index.tasksQueries.getAll.query);
  }

  /**
   * Retrieve one particular task
   * @return {Promise} promise
   */
  static get(id) {
    return _database2.default.one(_index.tasksQueries.get.query, [id]);
  }

  /**
   * Create a new task
   * @param {number} group_id ID of the group the task belongs to
   * @param {string} content Task's content
   * @return {Promise} promise (id, group_id, content, created_at)
   */
  static create(group_id, content) {
    return _database2.default.one(_index.tasksQueries.create.query, [group_id, content]);
  }

  /**
   * Update task with the given identifier
   * @param {number} id Unique identifier
   * @param {string} content Name
   * @param {boolean} status True to set as finished, otherwise false
   * @return {Promise} promise (id, group_id, content, created_at, finished_at)
   */
  static update(id, content, status) {
    return _database2.default.one(_index.tasksQueries.update.query, [id, content, status]);
  }

  /**
   * Remove the specified task
   * @param {number} id Task identifier
   * @return {Promise} promise
   */
  static remove(id) {
    return _database2.default.none(_index.tasksQueries.remove.query, [id]);
  }
}
exports.default = Task;
//# sourceMappingURL=Task.js.map