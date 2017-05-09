'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _database = require('../config/database/database');

var _database2 = _interopRequireDefault(_database);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

require('../config/database/migrate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_ava2.default.before(() => {
  // TODO: prepare testdb and make Task db-agnostic, so can test against testdb instead of real DB
  // /!\ this will inherently truncate all other tables linked with foreign keys
  // testdb.none('truncate tasks restart identity cascade')
});

_ava2.default.before('Task.getAll should get all registered tasks', (() => {
  var _ref = _asyncToGenerator(function* (t) {
    try {
      const expectedCount = yield _database2.default.one('select count(id) from tasks', null, function (c) {
        return +c.count;
      });
      const data = yield _Task2.default.getAll();
      t.true(data.length === expectedCount);
    } catch (error) {
      console.error('Error Task.getAll', error);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

(0, _ava2.default)('Task.get should get the first registered task', (() => {
  var _ref2 = _asyncToGenerator(function* (t) {
    try {
      const expected = yield _database2.default.one('select * from tasks where id=1');
      const data = yield _Task2.default.get(1);
      t.true(data.id === expected.id && data.content === expected.content && data.tag === expected.tag);
      /* t.is(data.created_at, expected.created_at)
      t.is(data.finished_at, expected.finished_at)
      t.is(data.deleted_at, expected.deleted_at) */
    } catch (error) {
      console.error('Error Task.get', error);
    }
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

(0, _ava2.default)('Task.create should properly add a new task', (() => {
  var _ref3 = _asyncToGenerator(function* (t) {
    try {
      const expected = 'test task';
      // make Task.create return full Task fields instead of only id ?
      const newID = yield _Task2.default.create(expected).then(function ({ id }) {
        return id;
      });
      const addedTask = yield _Task2.default.get(newID);
      t.true(addedTask.content === expected);
    } catch (error) {
      console.error('Error Task.create', error);
    }
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
})());

(0, _ava2.default)('Task.update should properly update first task\'s fields content, tag, and completed status', (() => {
  var _ref4 = _asyncToGenerator(function* (t) {
    try {
      const firstTask = yield _Task2.default.get(1);
      const updatedTask = yield _Task2.default.update(firstTask.id, 'edited content', 9, !firstTask.id.finishde_at).then(function () {
        return _Task2.default.get(firstTask.id);
      });
      t.true(updatedTask.content === 'edited content' && updatedTask.tag === 9 && updatedTask.finished_at !== null);
    } catch (error) {
      console.error('Error Task.update', error);
    }
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
})());

(0, _ava2.default)('Task.remove should remove the last registered task', (() => {
  var _ref5 = _asyncToGenerator(function* (t) {
    try {
      // reminder: getAll query has condition 'where deleted_at is null', while get(id) doesnot
      const allTasks = yield _Task2.default.getAll();
      const lastID = allTasks.length;
      const lastTask = yield _Task2.default.remove(lastID).then(function () {
        return _Task2.default.get(lastID);
      });
      t.false(lastTask.deleted_at === null);
    } catch (error) {
      console.error('Error Task.remove', error);
    }
  });

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
})());
//# sourceMappingURL=Task.test.js.map