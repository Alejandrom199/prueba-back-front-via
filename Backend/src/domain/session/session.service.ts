import { prisma } from '../../data/postgres/index'

export class SessionService {
// Obtener todos las sesiones
  async getSessions() {
    try {
      const sessions = await prisma.session.findMany();
      return sessions;
    } catch (error) {
      throw new Error("Error al obtener sesiones: " + error);
    }
  }

  // Obtener un rol por ID
  async getSessionById(id: number) {
    try {
      const session = await prisma.session.findUnique({
        where: { idSession: id }
      });
      return session;
    }
    catch (error) {
        throw new Error("Error al obtener sesión: " + error);
    }
  }

  // Crear un rol
  async createSession(userId: number) {
    try {

        const fechaIngreso = new Date()
        fechaIngreso.setMinutes(fechaIngreso.getMinutes() - fechaIngreso.getTimezoneOffset())

      const session = await prisma.session.create({
        data: {
          FechaIngreso: fechaIngreso,
          usuarios_idUsuario: userId
        }
      });
      return session;
    } catch (error) {
      throw new Error("Error al registrar sesión: " + error);
    }
  }

  async closeSession(sessionId: number) {
    try {

        const fechaCierre = new Date();
        fechaCierre.setMinutes(fechaCierre.getMinutes() - fechaCierre.getTimezoneOffset());

        const session = await prisma.session.update({
            where: { idSession: sessionId },
            data: { FechaCierre: fechaCierre}
        });
      return session;
    } catch (error) {
      throw new Error("Error al cerrar sesión: " + error);
    }
  }

  // Eliminar un rol
  async deleteSession(sessionId: number) {
    try {
      await prisma.session.delete({
        where: { idSession: sessionId }
      });
    } catch (error) {
      throw new Error("Error al eliminar sesión: " + error);
    }
  }
}