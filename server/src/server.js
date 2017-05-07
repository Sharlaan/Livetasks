import express from 'express'
import logger from 'morgan'
import helmet from 'helmet'
import hpp from 'hpp'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import websockets from 'socket.io'
import { common } from './config/settings'
import router from './router'

/**
 * Express server.
 */
const app = express()
const server = app.listen(common.port, function () {
  console.info(`API server listening on port ${common.port}`)
})

// Middlewares
app.use(helmet()) // app.disable('x-powered-by')
app.use(logger('dev')) // logs every request to the console
app.use(compression()) // gzip compression
app.use(bodyParser.json()) // parses bodies with content-type = 'application/json'
app.use(hpp()) // anti-HTTP Parameter Pollution
app.use(cors()) // Enable Cross-Origin Resource Sharing

/**
 * Attach Websockets API to the Express server
 * for push notifications.
 */
const io = websockets(server)
io.on('connect', router)

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') throw error
  const bind = (typeof port === 'string' ? 'Pipe ' : 'Port ') + common.port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} requires elevated privileges`)
    case 'EADDRINUSE':
      throw new Error(`${bind} is already in use`)
    default:
      throw error
  }
}
