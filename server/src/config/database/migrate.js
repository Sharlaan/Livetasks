import { createdb } from 'pgtools'
import db, { load } from './database'
import { database } from '../settings'

// used to migrate tables into a new database
const tables = new Map([
  ['tasks', load('schemes/schemeTasks.sql')] // Scheme for both tasks & taskGroups tables
])

const { database: dbname, ...configParams } = database
validateDB(db, configParams, dbname)

// Checks if database exists before migrating tables
// using callback instead of promise/async-await because
// we want to migrate tables in both cases
export default function validateDB (connection, configParams, dbname) {
  createdb(configParams, dbname, error => {
    if (error) console.warn('Warning!', error.message)
    for (let [tableName, query] of tables) {
      connection.none(query)
        .then(() => console.log(`Table '${tableName}' in DB '${dbname}' successfully reseted`))
        .catch(({message}) => console.error('Error', message))
    }
  })
}
