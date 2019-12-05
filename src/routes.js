import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import MatriculationController from './app/controllers/MatriculationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/', SessionController.store);
// Check-ins client side
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);
// Help Orders client side
routes.post('/students/:id/help_orders', HelpOrderController.store);
routes.get('/students/:id/help_orders', HelpOrderController.show);

routes.use(authMiddleware); // Só passa pelo middleware o que vem abaixo.

routes.get('/students', StudentController.index);
routes.get('/students/:name', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.destroy);
// Help Orders
routes.get('/help_orders', HelpOrderController.index);
routes.put('/help_orders/:id/answer', HelpOrderController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.destroy);

routes.post('/matriculations', MatriculationController.store);
routes.get('/matriculations', MatriculationController.index);

export default routes;
