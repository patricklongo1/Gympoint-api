import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import MatriculationController from './app/controllers/MatriculationController';

import authMiddleware from './app/middlewares/auth';
import CheckinController from './app/controllers/CheckinController';

const routes = new Router();

routes.post('/', SessionController.store);

routes.use(authMiddleware); // Só passa pelo middleware o que vem abaixo.

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.destroy);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.destroy);

routes.post('/matriculations', MatriculationController.store);
routes.get('/matriculations', MatriculationController.index);

export default routes;
