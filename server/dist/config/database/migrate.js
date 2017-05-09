'use strict';

var _pgtools = require('pgtools');

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _settings = require('../settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// used to migrate tables into a new database
const tables = new Map([['groups, tasks', (0, _database.load)('schemes/schemeTasks.sql')] // Scheme for both tasks & taskGroups tables
]);

const { database: dbname } = _settings.database,
      configParams = _objectWithoutProperties(_settings.database, ['database']);

(0, _pgtools.createdb)(configParams, dbname).then(() => console.log(`Datatable '${dbname}' successfully created`)).then(() => {
  for (let [tableNames, query] of tables) {
    _database2.default.none(query).then(() => console.log(`Table(s) '${tableNames}' in DB '${dbname}' successfully populated`)).catch(error => console.error(`Error populating tables in DB '${dbname}':`, error.message));
  }
}).catch(error => console.error(`Creation of datatable '${dbname}' failed:`, error.message));

// Note: to reset: you can use command 'yarn removedb',
// but beware as whole datatable will be deleted !

// CLI equivalents:
/*
 "removedb": "psql -U postgres -d livetasks -c \"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'livetasks'\" -d postgres -c \"DROP DATABASE livetasks\"",
 "createdb": "createdb -U postgres livetasks",
 "populatedb": "psql -U postgres livetasks < ./server/src/config/database/schemes/schemeTasks.sql",
 "test": "psql -U postgres -d livetasks -c \"SELECT * from tasks\""
 */
//# sourceMappingURL=migrate.js.map