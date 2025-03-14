export interface UsuarioUpdated {
  UserName?: string;
  Password?: string
  Mail?: string;
  Status?: 'active' | 'bloqueado' | string;
  failedAttempts?: number;
  SessionActive?: 'Y' | 'N' | string;
}
