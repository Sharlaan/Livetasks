import { load } from '../database'

// SQL queries for the table 'groups'
export const groupsQueries = {
  getAll: load('sqlQueries/groups/readall.sql'),
  get: load('sqlQueries/groups/read.sql'),
  create: load('sqlQueries/groups/create.sql'),
  remove: load('sqlQueries/groups/delete.sql'),
  update: load('sqlQueries/groups/update.sql')
}

// SQL queries for the table 'tasks'
export const tasksQueries = {
  getAll: load('sqlQueries/tasks/readall.sql'),
  get: load('sqlQueries/tasks/read.sql'),
  create: load('sqlQueries/tasks/create.sql'),
  remove: load('sqlQueries/tasks/delete.sql'),
  update: load('sqlQueries/tasks/update.sql')
}

// SQL queries for the table 'messages'
export const messagesQueries = {
  getAll: load('sqlQueries/messages/readall.sql'),
  get: load('sqlQueries/messages/read.sql'),
  create: load('sqlQueries/messages/create.sql'),
  remove: load('sqlQueries/messages/delete.sql'),
  update: load('sqlQueries/messages/update.sql')
}
