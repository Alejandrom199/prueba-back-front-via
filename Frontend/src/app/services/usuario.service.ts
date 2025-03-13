import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioLogin} from '../interfaces/UsuarioLogin';
import {UsuarioMostrar} from '../interfaces/UsuarioMostrar';

const API_URL = "http://localhost:3100/api/usuarios"

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<UsuarioMostrar[]>{
    return this.http.get<UsuarioMostrar[]>(`${API_URL}`);
  }

  getUsuarioById(id: number): Observable<UsuarioMostrar> {
    return this.http.get<UsuarioMostrar>(`${API_URL}/${id}`);
  }

  actualizarUsuario(id: number, usuario: any): Observable<UsuarioMostrar> {
    return this.http.put<UsuarioMostrar>(`${API_URL}/${id}`, usuario);
  }

  crearUsuario(usuario: any): Observable<UsuarioMostrar> {
    return this.http.post<UsuarioMostrar>(`${API_URL}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

}
