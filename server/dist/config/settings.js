'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const common = exports.common = {
  port: Number(process.env.PORT) || 3210
};

const socket = exports.socket = {
  port: 8000
};

const database = exports.database = {
  host: 'localhost',
  database: 'livetasks',
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  ssl: false
};

const test = exports.test = {
  host: 'localhost',
  port: 5432,
  database: 'livetasks_test',
  user: 'postgres',
  password: 'postgres'
};
//# sourceMappingURL=settings.js.map