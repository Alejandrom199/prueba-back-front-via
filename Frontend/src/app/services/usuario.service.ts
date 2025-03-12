import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioLogin} from '../interfaces/UsuarioLogin';
import {Usuario} from '../interfaces/Usuario';

const API_URL = "http://localhost:3100/api/usuarios"

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${API_URL}`);
  }


}
