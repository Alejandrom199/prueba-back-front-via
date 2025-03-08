import { Request, Response } from 'express';
import { RolService } from '../../domain/rol/rol.service';

export class RolController {

  private rolService: RolService;

  constructor(){
    this.rolService = new RolService()
  }

  getRoles = async (req: Request, res: Response): Promise<void> => {
    try{
      const roles = await this.rolService.getRoles();
      res.json(roles)
    }
    catch(error){
      res.status(500).json({message: 'Error obteniendo roles'})
    }
  }

  // Obtener un rol por ID
  getRolById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    try{
      const rol = await this.rolService.getRolById(id)
      if(!rol){
        res.status(404).json({message: 'Rol no encontrado'})
        return
      }
      res.json(rol)
    }
    catch(error){
      res.status(500).json({message: 'Error obteniendo rol'})
    }
  }

  createRol = async (req: Request, res: Response): Promise<void> => {
    const {RolName} = req.body
    try{
      const rol = await this.rolService.createRol(RolName)
      res.status(201).json(rol)
    }
    catch(error){
      if(error instanceof Error){
        res.status(400).json({message: error.message})
      }
      else{
        res.status(500).json({message: 'Error desconocido'})
      }
    }
  }

  // Actualizar un rol
  updateRol = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { RolName } = req.body;
    try {
      const rol = await this.rolService.updateRol(Number(id), RolName);
      res.status(200).json(rol); // Responder con el rol actualizado
    } 
    catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error desconocido' });
      }
    }
  }

  // Eliminar un rol
  deleteRol = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await this.rolService.deleteRol(Number(id));
      res.status(200).json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error desconocido' });
      }
    }
  }
}
