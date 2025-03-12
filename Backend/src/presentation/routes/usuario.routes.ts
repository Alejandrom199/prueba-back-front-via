import { UsuarioController } from './../../domain/usuario/usuario.controller';
import { Router } from 'express';

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.get('/', usuarioController.getUsuarios);
usuarioRouter.get('/:id', usuarioController.getUsuarioById);
usuarioRouter.post('/', usuarioController.createUsuario);
usuarioRouter.put('/:id', usuarioController.updateUsuario);
usuarioRouter.delete('/:id', usuarioController.deleteUsuario);
usuarioRouter.get('/:id/sesiones', usuarioController.getUsuarioConSesion)

export { usuarioRouter };
