import BullBoard from 'bull-board';
import { Router } from 'express';
import Brute from 'express-brute';
import multer from 'multer';

import BruteStore from './config/brute';
import multerConfig from './config/multer';
import Queue from './lib/Queue';

import authMiddleware from './app/middlewares/auth';

import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import ProviderController from './app/controllers/ProviderController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import validateAppointmentStore from './app/validators/AppointmentStore';
import validateSessionStore from './app/validators/SessionStore';
import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';

const BruteForce = new Brute(BruteStore);
BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

const routes = new Router();
const uploads = multer(multerConfig);

routes.post(
  '/session',
  BruteForce.prevent,
  validateSessionStore,
  SessionController.store
);

routes.post(
  '/users',
  BruteForce.prevent,
  validateUserStore,
  UserController.store
);

routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);
routes.post(
  '/appointments',
  validateAppointmentStore,
  AppointmentController.store
);
routes.get('/appointments', AppointmentController.index);
routes.get('/appointments/:id', AppointmentController.delete);
routes.get('/notifications', NotificationController.index);
routes.get('/notifications/:id', NotificationController.update);
routes.get('/schedule', ScheduleController.index);
routes.post('/files', uploads.single('file'), FileController.store);

// Only development
routes.use('/admin/queues', BullBoard.UI);

module.exports = routes;
