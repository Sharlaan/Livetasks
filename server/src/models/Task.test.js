import test from 'ava'
import db from '../config/database/database'
import Task from './Task'
import '../config/database/migrate'

test.before(() => {
  // TODO: prepare testdb and make Task db-agnostic, so can test against testdb instead of real DB
  // /!\ this will inherently truncate all other tables linked with foreign keys
  // testdb.none('truncate tasks restart identity cascade')
})

test.before('Task.getAll should get all registered tasks', async t => {
  try {
    const expectedCount = await db.one('select count(id) from tasks', null, c => +c.count)
    const data = await Task.getAll()
    t.true(data.length === expectedCount)
  } catch (error) {
    console.error('Error Task.getAll', error)
  }
})

test('Task.get should get the first registered task', async t => {
  try {
    const expected = await db.one('select * from tasks where id=1')
    const data = await Task.get(1)
    t.true(
      data.id === expected.id &&
      data.content === expected.content &&
      data.tag === expected.tag
    )
    /* t.is(data.created_at, expected.created_at)
    t.is(data.finished_at, expected.finished_at)
    t.is(data.deleted_at, expected.deleted_at) */
  } catch (error) {
    console.error('Error Task.get', error)
  }
})

test('Task.create should properly add a new task', async t => {
  try {
    const expected = 'test task'
    // make Task.create return full Task fields instead of only id ?
    const newID = await Task.create(expected).then(({id}) => id)
    const addedTask = await Task.get(newID)
    t.true(addedTask.content === expected)
  } catch (error) {
    console.error('Error Task.create', error)
  }
})

test('Task.update should properly update first task\'s fields content, tag, and completed status', async t => {
  try {
    const firstTask = await Task.get(1)
    const updatedTask = await Task.update(firstTask.id, 'edited content', 9, !firstTask.id.finishde_at)
                                  .then(() => Task.get(firstTask.id))
    t.true(
      updatedTask.content === 'edited content' &&
      updatedTask.tag === 9 &&
      updatedTask.finished_at !== null
    )
  } catch (error) {
    console.error('Error Task.update', error)
  }
})

test('Task.remove should remove the last registered task', async t => {
  try {
    // reminder: getAll query has condition 'where deleted_at is null', while get(id) doesnot
    const allTasks = await Task.getAll()
    const lastID = allTasks.length
    const lastTask = await Task.remove(lastID)
                               .then(() => Task.get(lastID))
    t.false(lastTask.deleted_at === null)
  } catch (error) {
    console.error('Error Task.remove', error)
  }
})
