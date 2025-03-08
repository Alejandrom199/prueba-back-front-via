// domain/auth/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const { identifier, password } = req.body;
    try {
      const usuario = await this.authService.login(identifier, password);
      
      res.status(200).json({ message: 'Login exitoso', usuario });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {

    const { userId } = req.body;
    try {
      await this.authService.logout(userId);
      res.json({ message: 'Logout exitoso' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error en logout', error: error.message });
    }
  };
}
