import { dropdb } from 'pgtools'
import { database } from '../settings'

const { database: dbname, ...configParams } = database

dropdb(configParams, dbname)
  .then(() => console.log(`Datatable '${dbname}' successfully deleted`))
  .catch(error => console.error(`Deletion of datatable '${dbname}' failed:`, error.message))
