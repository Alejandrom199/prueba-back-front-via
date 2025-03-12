import {Session} from './Session';

export interface Usuario {
  UserName: string
  Password: string
  Mail: string
  SessionActive: string
  Status: string
  failedAttempts: number

  Persona_idPersona2: number;
  sessions: Session[]
  roles: any[];
}
