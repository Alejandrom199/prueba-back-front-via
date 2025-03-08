import { Router } from 'express';
import { RolController } from '../../domain/rol/rol.controller';

const rolController = new RolController();

const rolRouter = Router();

// Rutas para manejar los roles
rolRouter.get('/', rolController.getRoles);
rolRouter.get('/:id', rolController.getRolById);
rolRouter.post('/', rolController.createRol); 
rolRouter.put('/:id', rolController.updateRol);
rolRouter.delete('/:id', rolController.deleteRol);

export { rolRouter };
