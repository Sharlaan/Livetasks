'use strict';

var _pgtools = require('pgtools');

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _settings = require('../settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const { database: dbname } = _settings.database,
      configParams = _objectWithoutProperties(_settings.database, ['database']);
_prompt2.default.start();

const property = {
  name: 'yesno',
  message: `Are you sure to reset databases ${dbname} and ${dbname}_test ?`,
  validator: /y[es]*|n[o]?/,
  warning: 'Must respond yes|y or no|n',
  default: 'no'
};

_prompt2.default.get(property, (error, { yesno }) => {
  if (error || /^n|no$/i.test(yesno)) {
    console.log('Canceled reset');
    process.exit(-1);
  }
  if (/^y|yes$/i.test(yesno)) return resetdb(configParams, dbname);
});

function resetdb(configParams, dbname) {
  (0, _pgtools.dropdb)(configParams, dbname).then(() => console.log(`DB ${dbname} successfully dropped.`)).catch(error => console.error(`Error dropping db ${dbname}!
      ${error}`));
  /*  dropdb(configParams, `${dbname}_test`)
      .then(() => console.log(`DB ${dbname}_test successfully dropped.`))
      .catch(error => console.error(
        `Error dropping db ${dbname}_test!
        ${error}`
      ))
      */
}

/*
SQL equivalent:

 -- Making sure the database exists
 SELECT * from pg_database where datname = 'my_database_name';

 -- Disallow new connections
 UPDATE pg_database SET datallowconn = 'false' WHERE datname = 'my_database_name';
 ALTER DATABASE my_database_name CONNECTION LIMIT 1;

 -- Terminate existing connections
 SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'my_database_name';

 -- Drop database
 DROP DATABASE my_database_name;
 */
//# sourceMappingURL=resetdb.js.map