import BullBoard from 'bull-board';
import { Router } from 'express';
import multer from 'multer';

import multerConfig from '~/config/multer';

import Queue from '~/lib/Queue';

import AppointmentController from '~/app/controllers/AppointmentController';
import FileController from '~/app/controllers/FileController';
import NotificationController from '~/app/controllers/NotificationController';
import ProviderController from '~/app/controllers/ProviderController';
import ScheduleController from '~/app/controllers/ScheduleController';
import SessionController from '~/app/controllers/SessionController';
import UserController from '~/app/controllers/UserController';
import authMiddleware from '~/app/middlewares/auth';

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
