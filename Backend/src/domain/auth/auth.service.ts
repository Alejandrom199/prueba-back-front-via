// domain/auth/auth.service.ts
import { prisma } from '../../data/postgres/index';
import bcrypt from 'bcrypt';

export class AuthService {

  private readonly MAX_ATTEMPTS = 3;

  async login(identifier: string, password: string) {
    // Buscar por UserName o Mail
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { UserName: identifier },
          { Mail: identifier }
        ]
      }
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si el usuario está bloqueado (Status !== 'active')
    if (usuario.Status !== 'active') {
      throw new Error('El usuario está bloqueado');
    }

    // Verificar si ya hay sesión activa
    if (usuario.SessionActive === 'S') {
      throw new Error('El usuario ya tiene una sesión activa');
    }

    // Comparar la contraseña
    const validPassword = await bcrypt.compare(password, usuario.Password);
    if (!validPassword) {
      // Aquí deberías incrementar el contador de intentos fallidos.
      // Suponiendo que agregaste un campo "failedAttempts" (por ejemplo, tipo Int)
      const nuevosIntentos = (usuario as any).failedAttempts ? (usuario as any).failedAttempts + 1 : 1;
      await prisma.usuario.update({
        where: { idUsuario: usuario.idUsuario },
        data: { failedAttempts: nuevosIntentos }
      });
      if (nuevosIntentos >= this.MAX_ATTEMPTS) {
        await prisma.usuario.update({
          where: { idUsuario: usuario.idUsuario },
          data: { Status: 'blocked' }
        });
        throw new Error('Usuario bloqueado por demasiados intentos fallidos');
      }
      throw new Error('Contraseña incorrecta');
    }

    // Si la contraseña es correcta, reiniciamos los intentos fallidos
    await prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: { failedAttempts: 0, SessionActive: 'S' }
    });

    // Registrar el inicio de sesión
    await prisma.session.create({
      data: {
        FechaIngreso: new Date(),
        usuarios_idUsuario: usuario.idUsuario,
        // FechaCierre se asignará al logout
      }
    });

    // (Opcional) Generar y retornar JWT aquí

    return usuario;
  }

  async logout(userId: number) {
    // Actualizar la sesión: encontrar la sesión activa para este usuario y asignar FechaCierre
    const session = await prisma.session.findFirst({
      where: { usuarios_idUsuario: userId, FechaCierre: null },
      orderBy: { FechaIngreso: 'desc' }
    });
    if (session) {
      await prisma.session.update({
        where: { idSession: session.idSession },
        data: { FechaCierre: new Date() }
      });
    }
    // Actualizar el usuario: marcar que no tiene sesión activa
    await prisma.usuario.update({
      where: { idUsuario: userId },
      data: { SessionActive: 'N' }
    });
  }
}
