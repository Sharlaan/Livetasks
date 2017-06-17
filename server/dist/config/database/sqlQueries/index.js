'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messagesQueries = exports.tasksQueries = exports.groupsQueries = undefined;

var _database = require('../database');

// SQL queries for the table 'groups'
const groupsQueries = exports.groupsQueries = {
  getAll: (0, _database.load)('sqlQueries/groups/readall.sql'),
  get: (0, _database.load)('sqlQueries/groups/read.sql'),
  create: (0, _database.load)('sqlQueries/groups/create.sql'),
  remove: (0, _database.load)('sqlQueries/groups/delete.sql'),
  update: (0, _database.load)('sqlQueries/groups/update.sql')

  // SQL queries for the table 'tasks'
};const tasksQueries = exports.tasksQueries = {
  getAll: (0, _database.load)('sqlQueries/tasks/readall.sql'),
  get: (0, _database.load)('sqlQueries/tasks/read.sql'),
  create: (0, _database.load)('sqlQueries/tasks/create.sql'),
  remove: (0, _database.load)('sqlQueries/tasks/delete.sql'),
  update: (0, _database.load)('sqlQueries/tasks/update.sql')

  // SQL queries for the table 'messages'
};const messagesQueries = exports.messagesQueries = {
  getAll: (0, _database.load)('sqlQueries/messages/readall.sql'),
  get: (0, _database.load)('sqlQueries/messages/read.sql'),
  create: (0, _database.load)('sqlQueries/messages/create.sql'),
  remove: (0, _database.load)('sqlQueries/messages/delete.sql'),
  update: (0, _database.load)('sqlQueries/messages/update.sql')
};
//# sourceMappingURL=index.js.map