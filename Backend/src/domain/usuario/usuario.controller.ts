import { Request, Response } from 'express';
import { UsuarioService } from './usuario.service';
import { SessionService } from '../session/session.service';

export class UsuarioController {
  private usuarioService: UsuarioService;
  private sessionServcice: SessionService;

  constructor() {
    this.usuarioService = new UsuarioService();
    this.sessionServcice = new SessionService();
  }

  getUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.usuarioService.getUsuarios();
      res.json(usuarios); // Enviamos la respuesta
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo usuarios' });
    }
  };

  getUsuarioById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
      const usuario = await this.usuarioService.getUsuarioById(id);
      if (!usuario) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      res.json(usuario); // Enviamos la respuesta
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo usuario' });
    }
  };

  createUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuario = await this.usuarioService.createUsuario(req.body);
      res.status(201).json(usuario); 
    } catch (error) {
      if(error instanceof Error){
        res.status(500).json({ message: 'Error creando usuario', error: error.message });
      }
      else {
        console.error('Error desconocido', error);
        res.status(500).json({ message: 'Error desconocido' });
      }
    }
  };
  

  updateUsuario = async (req: Request, res: Response): Promise<void> => {
    const { userId, rolesIds, ...userData } = req.body; // Desestructuramos los rolesIds y demás datos del usuario

    try {
      // Actualizamos el usuario y sus roles
      const updatedUser = await this.usuarioService.updateUsuario(userId, userData, rolesIds);
      res.status(200).json(updatedUser); // Respondemos con el usuario actualizado
    } catch (error) {
      res.status(500).json({ message: 'Error actualizando usuario' });
    }
  };

  deleteUsuario = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
      await this.usuarioService.deleteUsuario(id);
      res.json({ message: 'Usuario eliminado' }); // Enviamos la respuesta
    } catch (error) {
      res.status(500).json({ message: 'Error eliminando usuario' });
    }
  };

  obtenerSesionesDelUsuario = async(req: Request, res: Response) => {
    
    const {idUsuario} = req.params

    console.log(idUsuario)

    try{
      const sesiones = await this.sessionServcice.obtenerSesionesDelUsuario(Number(idUsuario))
      res.json(sesiones)
    }
    catch(error){
      res.status(500).json({message: 'Error al obtener las sessiones', error, idUsuario})
    }
    
  }
}