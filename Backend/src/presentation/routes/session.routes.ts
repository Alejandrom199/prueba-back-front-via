import { Router } from 'express';
import { SessionController } from '../../domain/session/session.controller';

const sessionController = new SessionController();
const sessionRouter = Router();

sessionRouter.get('/', sessionController.getSessions); 
sessionRouter.get('/:id', sessionController.getSessionById); 
sessionRouter.post('/', sessionController.createSession); 
sessionRouter.put('/:id/close', sessionController.closeSession); 
sessionRouter.delete('/:id', sessionController.deleteSession);

export { sessionRouter };
