'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testdb = undefined;
exports.load = load;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _pgPromise = require('pg-promise');

var _pgPromise2 = _interopRequireDefault(_pgPromise);

var _settings = require('../settings');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// necessary for testing with absolute paths

function load(file) {
  return new _pgPromise.QueryFile(_path2.default.resolve(__dirname, file), { minify: true });
}

const pgp = (0, _pgPromise2.default)({ promiseLib: _bluebird2.default });
const testdb = exports.testdb = pgp(_settings.test);
exports.default = pgp(_settings.database);
//# sourceMappingURL=database.js.map