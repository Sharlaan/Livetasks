'use strict';
/* eslint-disable camelcase */
/**
 * Group constructor
 * @param {number} id - Group identifier
 * @param {string} name - Group Name
 * @param {string} baseApiUrl - URL for the API from which to fetch/send data
 * @param {Socket} socket - socket instance used for communicating with the API
 */

function TaskGroup(id, name, baseApiUrl, socket) {
  /**
   * Identifier
   * @type {number}
   */
  this.id = id;

  /**
   * Name
   * @type {string}
   */
  this.name = name;

  /**
   * API url from which to fetch data
   * @type {string}
   */
  this.baseApiUrl = baseApiUrl;

  /**
   * @type {Socket}
   */
  this.socket = socket;

  /**
   * Tasks
   * @type {Array.<Object>}
   */
  this.tasks = [];

  /**
   * The view
   * @type {TaskGroupView}
   */
  this.view = new TaskGroupView(this); // eslint-disable-line no-undef
}

/**
 * Init
 * @param {DomElement} container - Container/Parent element
 * @return {boolean} True if everything was successful, otherwise false
 */
TaskGroup.prototype.init = function (container) {
  return this.view.create(container, this);
};

/**
 * Load tasks from an array
 * @param {Array.<Object>} tasks - The tasks
 */
TaskGroup.prototype.load = function (tasks) {
  // Sort tasks by finished_at then by created_at properties
  // sort order: "oldest has priority"
  tasks.sort(function (a, b) {
    var af = new Date(a.finished_at);
    var bf = new Date(b.finished_at);
    var ac = new Date(a.created_at);
    var bc = new Date(b.created_at);

    if (af < bf) return -1;
    if (af > bf) return 1;
    if (ac < bc) return -1;
    if (ac > bc) return 1;
  });
  // Load tasks
  this.tasks = tasks;
  // Create views
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;
      var id = _ref.id,
          content = _ref.content,
          finished_at = _ref.finished_at;

      this.view.createTask(id, content, finished_at !== null);
    }

    // Update progression view
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length);
};

/**
 * Create a new task
 * @param {string} content - The content of the task
 */
TaskGroup.prototype.createTask = function (content) {
  var _this = this;

  this.socket.emit('createTask', JSON.stringify({ groupId: this.id, content: content }), function (_ref2) {
    var status = _ref2.status,
        message = _ref2.message,
        data = _ref2.data;

    if (status === 'failed') return console.error('Error with createTask fetch\n', message);
    console.log('createTask data', data);
    // Add to the DOM
    _this.onTaskCreated(data);
  });
};

/**
 * Update a task
 * @param {number} id - Task identifier
 * @param {string} content - The content of the task
 * @param {boolean} finished - True to set as finished, otherwise false
 */
TaskGroup.prototype.updateTask = function (id, content, finished) {
  var _this2 = this;

  // console.log('TaskGroup updateTask: Asking server for update (+ broadcast if successful)', {id, content, finished})
  this.socket.emit('updateTask', JSON.stringify({ id: id, content: content, finished: finished }), function (_ref3) {
    var status = _ref3.status,
        message = _ref3.message,
        data = _ref3.data;

    if (status === 'failed') return console.error('Error with updateTask fetch\n', message);
    // console.log('Server answered @ TaskGroup updateTask:', data)
    _this2.onTaskUpdated(data); // Update the DOM element and its model
  });
};

/**
 * Remove a given task
 * @param {number} id - Task identifier
 */
TaskGroup.prototype.removeTask = function (id) {
  var _this3 = this;

  this.socket.emit('removeTask', JSON.stringify({ groupId: this.id, id: id }), function (_ref4) {
    var status = _ref4.status,
        message = _ref4.message;

    if (status === 'failed') return console.error('Error with removeTask fetch\n', message);
    // console.log'removeTask data', data)
    _this3.onTaskRemoved(id); // Remove from the DOM
  });
};

/**
 * Call when a task is created
 * @param {number} id - Task identifier
 * @param {string} content - The content of the task
 * @param {Date} created_at - Date of creation
 */
TaskGroup.prototype.onTaskCreated = function (_ref5) {
  var id = _ref5.id,
      content = _ref5.content,
      created_at = _ref5.created_at;

  // Give the sorting policy, the newly created task will be inserted
  // at index before the first "done" task.
  var index = this.tasks.findIndex(function (task) {
    return task.finished_at !== null;
  });
  var index2insert = index !== -1 ? index : this.tasks.length - 1;
  this.tasks.splice(index2insert === 0 ? 0 : index2insert - 1, 0, { id: id, content: content, created_at: created_at, finished_at: null, deleted_at: null });
  this.view.createTask(id, content, false, index2insert);
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length);
};

/**
 * Call when a task is updated
 * @param {number} id Task - identifier
 * @param {string} content - Task content
 * @param {string} finished_at - Completion date
 */
TaskGroup.prototype.onTaskUpdated = function (_ref6) {
  var id = _ref6.id,
      content = _ref6.content,
      finished_at = _ref6.finished_at;

  // console.log'onTaskUpdated\nfinished_at', finished_at, '\ncontent', content)
  // Update model
  var task = this.tasks.find(function (task) {
    return task.id === id;
  });
  if (task) {
    task.content = content;
    task.finished_at = finished_at;
  }

  // Update view
  this.view.updateTask(id, content, finished_at);
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length);
};

/**
 * Call when a task is removed
 * @param {number} id - Task identifier
 */
TaskGroup.prototype.onTaskRemoved = function (id) {
  // Remove model
  var index = this.tasks.findIndex(function (task) {
    return task.id === +id;
  });
  if (index !== -1) this.tasks.splice(index, 1);

  // Update view
  this.view.removeTask(id);
  this.view.updateCompletion(this.countRemainingTasks(), this.tasks.length);
};

/**
 * Count un-completed tasks
 * @return {number} - A positive integer
 */
TaskGroup.prototype.countRemainingTasks = function () {
  return this.tasks.reduce(function (total, task) {
    return total += task.finished_at === null ? 1 : 0; // eslint-disable-line no-return-assign
  }, 0);
};
//# sourceMappingURL=TaskGroup.js.map