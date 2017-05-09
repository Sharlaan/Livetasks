'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Task = require('../models/Task');

var _Task2 = _interopRequireDefault(_Task);

var _translations = require('../config/translations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable standard/no-callback-literal */


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
} = _translations.tasks;

exports.default = {
  /**
   * Retrieve getAll tasks
   * @param {null} data - received from client
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  all(data, response) {
    return _asyncToGenerator(function* () {
      try {
        const data = yield _Task2.default.getAll();
        response({
          status: 'success',
          data,
          message: TASK_ALL_SUCCESS
        });
      } catch (error) {
        console.log('Error @ TasksController.all:\n', error);
        response({
          status: 'failed',
          message: TASK_ALL_ERROR
        });
      }
    })();
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
  create(data, response) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const { groupId, content } = JSON.parse(data);
      if (!/^\d+$/.test(groupId) || typeof content !== 'string') {
        return response({
          status: 'failed',
          message: TASK_CREATE_INVALID_PARAM
        });
      }
      try {
        const createdTask = yield _Task2.default.create(groupId, content);
        if (createdTask) {
          // Notify other clients by calling PushNotifier
          _this.broadcast.emit('onTaskCreated', createdTask);
          // respond to client
          response({
            status: 'success',
            data: createdTask,
            message: TASK_CREATE_SUCCESS
          });
        }
      } catch (error) {
        console.log('Error @ TasksController.create:\n', error);
        response({
          status: 'failed',
          message: TASK_CREATE_ERROR
        });
      }
    })();
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
  update(data, response) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const { id, content, finished } = JSON.parse(data);
      if (!/^\d+$/.test(id) || typeof content !== 'string' || typeof finished !== 'boolean') {
        return response({
          status: 'failed',
          message: TASK_UPDATE_INVALID_PARAM
        });
      }
      try {
        const updatedTask = yield _Task2.default.update(+id, content, finished);
        // Notify other clients by calling PushNotifier
        _this2.broadcast.emit('onTaskUpdated', updatedTask);
        // respond to client
        response({
          status: 'success',
          data: updatedTask,
          message: TASK_UPDATE_SUCCESS
        });
      } catch (error) {
        console.log('Error @ TasksController.update:\n', error);
        response({
          status: 'failed',
          message: TASK_UPDATE_ERROR
        });
      }
    })();
  },

  /**
   * Remove the specified task
   * @param {string} data - stringified object from client
   * @param {number} data.id - Task ID
   * @param {function} response - callback function used by client
   * which will receive the server data
   * @return {json} response
   */
  remove(data, response) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const { groupId, id } = JSON.parse(data);
      if (!/^\d+$/.test(id) || !/^\d+$/.test(id)) {
        return response({
          status: 'failed',
          message: TASK_REMOVE_INVALID_PARAM
        });
      }
      try {
        yield _Task2.default.remove(id);
        // Notify other clients by calling PushNotifier
        _this3.broadcast.emit('onTaskRemoved', { groupId, id });
        // respond to client
        response({
          status: 'success',
          message: TASK_REMOVE_SUCCESS
        });
      } catch (error) {
        console.log('Error @ TasksController.remove:\n', error);
        response({
          status: 'failed',
          message: TASK_REMOVE_ERROR
        });
      }
    })();
  }
};
//# sourceMappingURL=TasksController.js.map