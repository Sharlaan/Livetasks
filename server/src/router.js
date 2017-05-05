import { Router } from 'express'
import tasksController from './controllers/TasksController'
// import tchatController from './controllers/TchatController'

export default function router (app, tasksPushNotifier) {
  const tasksRouter = Router()
  // const tchatRouter = Router()

  tasksRouter
    .get('/tasks', tasksController.all, tasksPushNotifier.newClient)
    .post('/tasks', tasksController.create, tasksPushNotifier.create)
    .patch('/tasks', tasksController.update, tasksPushNotifier.update)
    .delete('/tasks', tasksController.remove, tasksPushNotifier.remove)

  app.use('/', tasksRouter)
}
