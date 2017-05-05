import { load } from '../database'

// SQL queries for the table 'tasks'
export const tasksQueries = {
  getAll: load('sqlQueries/tasks/readall.sql'),
  get: load('sqlQueries/tasks/read.sql'),
  create: load('sqlQueries/tasks/create.sql'),
  remove: load('sqlQueries/tasks/delete.sql'),
  update: load('sqlQueries/tasks/update.sql')
}

// SQL queries for the table 'taskGroups'
export const taskGroupsQueries = {
  getAll: load('sqlQueries/taskGroups/readall.sql'),
  get: load('sqlQueries/taskGroups/read.sql'),
  create: load('sqlQueries/taskGroups/create.sql'),
  remove: load('sqlQueries/taskGroups/delete.sql'),
  update: load('sqlQueries/taskGroups/update.sql')
}
