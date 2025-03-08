import { Request, Response } from 'express';
import { SessionService } from "../../domain/session/session.service";

export class SessionController {

    private sessionService: SessionService

    constructor(){
        this.sessionService = new SessionService()
    }

    // Crear una sesión (inicio de sesión)
  createSession = async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      const session = await this.sessionService.createSession(userId);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Error desconocido" });
    }
  };

  // Cerrar sesión
  closeSession = async (req: Request, res: Response) => {
    const sessionId = parseInt(req.params.id);
    try {
      const session = await this.sessionService.closeSession(sessionId);
      res.status(200).json(session);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Error desconocido" });
    }
  };

  // Obtener todas las sesiones
  getSessions = async (req: Request, res: Response) => {
    try {
      const sessions = await this.sessionService.getSessions();
      res.status(200).json(sessions);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error desconocido" });
    }
  };

  // Obtener sesión por ID
  getSessionById = async (req: Request, res: Response) : Promise<void> => {
    const sessionId = parseInt(req.params.id);
    try {
      const session = await this.sessionService.getSessionById(sessionId);
      if (!session) {
        res.status(404).json({ message: "Sesión no encontrada" });
        return
    }
      res.status(200).json(session);
    }
    catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error desconocido" });
    }
  };

  // Eliminar sesión
  deleteSession = async (req: Request, res: Response) => {
    const sessionId = parseInt(req.params.id);
    try {
      await this.sessionService.deleteSession(sessionId);
      res.status(200).json({ message: "Sesión eliminada correctamente" });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error desconocido" });
    }
  };
}