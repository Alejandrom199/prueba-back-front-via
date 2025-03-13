import {Session} from './Session';
import {Role} from './Role';
import {UsuarioRole} from './UsuarioRole';

export interface UsuarioMostrar {
  idUsuario: number;
  UserName: string;
  Mail: string;
  Status: string;
  SessionActive: string;
  Persona_idPersona2: number;
  failedAttempts: number
  Rol: UsuarioRole;
  UltimaSesion: Session;
}
