import { Request, Response } from 'express';
import { UsuarioService } from './usuario.service';

export class UsuarioController {
  private usuarioService: UsuarioService;

  constructor() {
    this.usuarioService = new UsuarioService();
  }

  getUsuarios = async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await this.usuarioService.getUsuarios();
      res.json(usuarios); // Enviamos la respuesta
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo usuarios' , error});
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
    const userId = parseInt(req.params.id, 10)
    const { rolesIds, ...userData } = req.body; // Desestructuramos los rolesIds y demás datos del usuario

    if (isNaN(userId)) {
      res.status(400).json({ message: 'ID de usuario inválido' });
      return;
    }

    try {
      const updatedUser = await this.usuarioService.updateUsuario(userId, userData, rolesIds);
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Error actualizando usuario', error: error.message });
      }
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

  getUsuarioConSesion = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
      const usuario = await this.usuarioService.getUsuarioConUltimaSesion(id);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ message: 'Error obteniendo usuario con sesión', error });
    }
  };
  
}