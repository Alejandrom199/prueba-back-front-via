import { prisma } from '../../data/postgres/index'

export class RolService {

  // Obtener todos los roles
  async getRoles() {
    try {
      const roles = await prisma.rol.findMany();
      return roles;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un rol por ID
  async getRolById(id: number) {
    try {
      const rol = await prisma.rol.findUnique({
        where: { idRol: id }
      });
      return rol;
    }
    catch (error) {
      throw error;
    }
  }


  // Crear un rol
  async createRol(RolName: string) {
    try {
      // Buscar si ya existe un rol con ese nombre (usamos findFirst ya que 'RolName' no es único)
      const rolExistente = await prisma.rol.findFirst({
        where: { RolName },
      });

      if (rolExistente) {
        throw new Error("El rol ya existe");
      }

      // Crear el nuevo rol
      const rol = await prisma.rol.create({
        data: { RolName },
      });

      return rol;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un rol
  async updateRol(id: number, RolName: string) {
    try {
      const rol = await prisma.rol.update({
        where: { idRol: id },  // Buscamos el rol por idRol, que es único
        data: { RolName },
      });
      return rol;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un rol
  async deleteRol(id: number) {
    try {
      await prisma.rol.delete({
        where: { idRol: id },  // Eliminamos por idRol que es único
      });
    }
    catch (error) {
      throw error;
    }
  }
}
