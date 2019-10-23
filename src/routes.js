import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/', SessionController.store);

routes.use(authMiddleware); // Só passa pelo middleware o que vem abaixo.
routes.post('/students', StudentController.store);

export default routes;
