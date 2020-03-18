import { Router } from 'express';
import multer from 'multer';
import BullBoard from 'bull-board';

import Queue from './lib/Queue';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/session', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.get('/appointments/:id', AppointmentController.delete);
routes.get('/notifications', NotificationController.index);
routes.get('/notifications/:id', NotificationController.update);
routes.get('/schedule', ScheduleController.index);
routes.post('/files', uploads.single('file'), FileController.store);

// Only development
routes.use('/admin/queues', BullBoard.UI);

module.exports = routes;
