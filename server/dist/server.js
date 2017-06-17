'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _hpp = require('hpp');

var _hpp2 = _interopRequireDefault(_hpp);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _settings = require('./config/settings');

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: turn into WSS with http://stackoverflow.com/a/38525463/3740223 (wait for NodeJSv8+ for http2 implemented in core)
/**
 * Express server.
 */
const app = (0, _express2.default)();
const server = app.listen(_settings.common.port, function () {
  console.info(`API server listening on port ${_settings.common.port}`);
}

// Middlewares
);app.use((0, _helmet2.default)() // app.disable('x-powered-by')
);app.use((0, _morgan2.default)('dev') // logs every request to the console
);app.use((0, _compression2.default)() // gzip compression
);app.use(_bodyParser2.default.json() // parses bodies with content-type = 'application/json'
);app.use((0, _hpp2.default)() // anti-HTTP Parameter Pollution
);app.use((0, _cors2.default)() // Enable Cross-Origin Resource Sharing

/**
 * Attach Websockets API to the Express server
 * for push notifications.
 */
);const io = (0, _socket2.default)(server);
io.on('connect', _router2.default

/**
 * Event listener for HTTP server "error" event.
 */
);function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = (typeof port === 'string' ? 'Pipe ' : 'Port ') + _settings.common.port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`);
    default:
      throw error;
  }
}
//# sourceMappingURL=server.js.map