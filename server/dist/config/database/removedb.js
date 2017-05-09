'use strict';

var _pgtools = require('pgtools');

var _settings = require('../settings');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const { database: dbname } = _settings.database,
      configParams = _objectWithoutProperties(_settings.database, ['database']);

(0, _pgtools.dropdb)(configParams, dbname).then(() => console.log(`Datatable '${dbname}' successfully deleted`)).catch(error => console.error(`Deletion of datatable '${dbname}' failed:`, error.message));
//# sourceMappingURL=removedb.js.map