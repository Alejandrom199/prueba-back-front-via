// domain/usuario/usuario.service.ts
import { prisma } from '../../data/postgres/index';
import { generarCorreo } from '../../utils/generarCorreo';
import { validarUserName, validarPassword, validarIdentificacion } from '../../utils/validations';
import bcrypt from 'bcrypt';

export class UsuarioService {

  async getUsuarios() {
    try{
      const usuarios = await prisma.usuario.findMany();
      return usuarios
    }
    catch(error){
      throw error
    }
  }

  async getUsuarioById(id: number) {
    try{
      const usuario = await prisma.usuario.findUnique({ 
        where: { idUsuario: id } 
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
  async updateUsuario(userId: number, userData: any, rolesIds: number[]) {
    try {
      // Primero, actualizamos la información del usuario
      const updatedUser = await prisma.usuario.update({
        where: { idUsuario: userId },
        data: userData,
      });

      // Eliminar los roles antiguos del usuario
      await prisma.usuarioRol.deleteMany({
        where: {
          usuarioId: userId
        }
      });

      // Asignar los nuevos roles al usuario
      for (const rolId of rolesIds) {
        await prisma.usuarioRol.create({
          data: {
            usuarioId: userId,
            rolId: rolId
          }
        });
      }

      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw new Error("Error al actualizar el usuario");
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

  
}
