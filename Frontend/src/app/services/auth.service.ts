import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLogin } from '../interfaces/UsuarioLogin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = 'http://localhost:3100/api/auth';

  constructor(private http: HttpClient) { }

  login(data: UsuarioLogin): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data)
  }

  logout(userId: number): Observable<any>{
    return this.http.post(`${this.API_URL}/logout`, {userId})
  }
}
