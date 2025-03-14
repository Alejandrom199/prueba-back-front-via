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
  

    const nuevaPersona = await prisma.persona.create({
      data: {
        Nombres: persona.Nombres,
        Apellidos: persona.Apellidos,
        Identificacion: persona.Identificacion,
        FechaNacimiento: new Date(persona.FechaNacimiento) 
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
  
      await prisma.usuario.update({
        where: { idUsuario: userId },
        data: userData,
      });
  
      if (rolesIds.length > 0) {
        // Eliminar roles anteriores
        await prisma.usuarioRol.deleteMany({
          where: { usuarioId: userId },
        });
  
        // Agregar nuevos roles
        await prisma.usuarioRol.createMany({
          data: rolesIds.map(rolId => ({
            usuarioId: userId,
            rolId: rolId,
          })),
        });
      }
  
      return await prisma.usuario.findUnique({
        where: { idUsuario: userId },
        include: {
          roles: {
            include: {
              rol: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      if (error instanceof Error) {
        throw new Error('Error al actualizar el usuario: ' + error.message);
      }
      throw error;
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

  async  crearUsuarioAdmin() {
    // Primero, verificar si el rol "administrador" ya existe
    let rolAdmin = await prisma.rol.findUnique({
      where: {
        idRol: 1
      },
    });
  
    // Si el rol no existe, crearlo
    if (!rolAdmin) {
      rolAdmin = await prisma.rol.create({
        data: {
          RolName: 'administrador',
        },
      });
    }
  
    // Verificar si ya existe un usuario con el rol 'administrador'
    const usuarioAdmin = await prisma.usuario.findFirst({
      where: {
        roles: {
          some: {
            rolId: rolAdmin.idRol, // Usar el idRol del rol administrador
          },
        },
      },
      include: {
        roles: true, // Incluir roles para verificar
      },
    });
  
    if (!usuarioAdmin) {
      // Si no existe el usuario administrador, crear el nuevo usuario
      const hashedPassword = await bcrypt.hash('@dmin1', 10);  // Cifrar la contraseña
  
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          UserName: 'admin',
          Password: hashedPassword, // Usa la contraseña cifrada
          Mail: 'admin@admin.com',
          SessionActive: 'S',
          Status: 'active',
          failedAttempts: 0,
          Persona_idPersona2: 5,
          roles: {
            create: {
              rolId: rolAdmin.idRol, 
            },
          },
        },
      });
  
      console.log('Usuario administrador creado:', nuevoUsuario);
    } else {
      console.log('El usuario administrador ya existe');
    }
  }
}
