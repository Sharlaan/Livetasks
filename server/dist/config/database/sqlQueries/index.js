'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskGroupsQueries = exports.tasksQueries = undefined;

var _database = require('../database');

// SQL queries for the table 'tasks'
const tasksQueries = exports.tasksQueries = {
  getAll: (0, _database.load)('sqlQueries/tasks/readall.sql'),
  get: (0, _database.load)('sqlQueries/tasks/read.sql'),
  create: (0, _database.load)('sqlQueries/tasks/create.sql'),
  remove: (0, _database.load)('sqlQueries/tasks/delete.sql'),
  update: (0, _database.load)('sqlQueries/tasks/update.sql')
};

// SQL queries for the table 'taskGroups'
const taskGroupsQueries = exports.taskGroupsQueries = {
  getAll: (0, _database.load)('sqlQueries/taskGroups/readall.sql'),
  get: (0, _database.load)('sqlQueries/taskGroups/read.sql'),
  create: (0, _database.load)('sqlQueries/taskGroups/create.sql'),
  remove: (0, _database.load)('sqlQueries/taskGroups/delete.sql'),
  update: (0, _database.load)('sqlQueries/taskGroups/update.sql')
};
//# sourceMappingURL=index.js.map