import promiseLib from 'bluebird'
import pgPromise, { QueryFile } from 'pg-promise'
import { database, test } from '../settings'
import path from 'path' // necessary for testing with absolute paths

export function load (file) {
  return new QueryFile(path.resolve(__dirname, file), {minify: true})
}

const pgp = pgPromise({promiseLib})
export const testdb = pgp(test)
export default pgp(database)
