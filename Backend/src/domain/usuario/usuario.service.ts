// domain/usuario/usuario.service.ts
import { prisma } from '../../data/postgres/index';
import { generarCorreo } from '../../utils/generarCorreo';
import { validarUserName, validarPassword, validarIdentificacion } from '../../utils/validations';
import bcrypt from 'bcrypt';

export class UsuarioService {

  async getUsuarios() {
    try {
      const usuarios = await prisma.usuario.findMany({
        include: {
          sessions: true,
          roles: {
            include: {
              rol: true
            }
          }
        }
      });
  
      return usuarios;
    } catch (error) {
      throw error;
    }
  }
  

  async getUsuarioById(id: number) {
    try{
      const usuario = await prisma.usuario.findUnique({ 
        where: { idUsuario: id } ,
        include: {
          sessions: true,
          roles: {
            include: {
              rol: true
            }
          }
        }
      });
      return usuario
    }
    catch(error){
      throw error
    }
  }

  async createUsuario(data: any) {
    const { UserName, Password, persona } = data;
  
    // Validaciones:
    if (!validarUserName(UserName)) {
      throw new Error('El nombre de usuario no cumple los parámetros');
    }
    if (!validarPassword(Password)) {
      throw new Error('La contraseña no cumple los parámetros');
    }
    if (!validarIdentificacion(persona.Identificacion)) {
      throw new Error('La identificación no cumple los parámetros');
    }
  
    // Generar correo a partir de la persona
    const correoGenerado = await generarCorreo(persona.Nombres, persona.Apellidos);
    
    // Preparar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);
  
    // Insertar Persona y Usuario de forma transaccional (dependiendo de tus reglas)
    const nuevaPersona = await prisma.persona.create({
      data: {
        Nombres: persona.Nombres,
        Apellidos: persona.Apellidos,
        Identificacion: persona.Identificacion,
        FechaNacimiento: new Date(persona.FechaNacimiento) // Asegúrate de que la fecha es válida
      }
    });
  
    // Verificar si ya existe una cuenta asociada a esta persona
    const cuentaExistente = await prisma.usuario.findFirst({
      where: { Persona_idPersona2: nuevaPersona.idPersona }
    });
    if (cuentaExistente) {
      throw new Error('La persona ya tiene una cuenta registrada');
    }
  
    const statusLimpio = 'active'.trim()

    // Crear el usuario
    return prisma.usuario.create({
      data: {
        UserName,
        Password: hashedPassword,
        Mail: correoGenerado,
        SessionActive: 'N', // Ninguna sesión activa al crearse
        Status: statusLimpio,
        Persona_idPersona2: nuevaPersona.idPersona // Relacionar el usuario con la persona
      }
    });
  }
  

  // Actualizar usuario y roles
  async updateUsuario(userId: number, userData: any, rolesIds: number[] = []) {
    try {

      const updatedUser = await prisma.usuario.update({
        where: { idUsuario: userId },
        data: userData,
      });
  
      // Si se enviaron nuevos roles, actualizar la relación en UsuarioRol
      if (rolesIds.length > 0) {
        // Eliminar los roles anteriores del usuario
        await prisma.usuarioRol.deleteMany({
          where: { usuarioId: userId },
        });
  
        // Agregar los nuevos roles en la tabla intermedia
        await prisma.usuarioRol.createMany({
          data: rolesIds.map(rolId => ({
            usuarioId: userId,
            rolId: rolId,
          })),
        });
      }
  
      // Retornar el usuario con sus roles actualizados
      return await prisma.usuario.findUnique({
        where: { idUsuario: userId },
        include: { roles: { include: { rol: true } } }, // Incluir info de roles
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      if(error instanceof Error){
        throw new Error("Error al actualizar el usuario: " + error.message);
      }
      
    }
  }
  

  async deleteUsuario(id: number) {
    try{
      await prisma.usuario.delete({
        where: { idUsuario: id }
      });
    }
    catch(error){
      throw error
    }
  }

  async getUsuarioConUltimaSesion(idUsuario: number) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { idUsuario },
        include: {
          sessions: {
            orderBy: { FechaIngreso: 'desc' },
            take: 1
          }
        }
      });
      return usuario;
    } catch (error) {
      throw new Error('Error al obtener usuario con sesión: ' + error);
    }
  }
  

  
}
