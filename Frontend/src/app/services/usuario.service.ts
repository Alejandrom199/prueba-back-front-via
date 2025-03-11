import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsuarioLogin} from '../interfaces/UsuarioLogin';

const API_URL = "http://localhost:3100/api/usuarios"

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<UsuarioLogin[]>{
    return this.http.get<UsuarioLogin[]>(`${API_URL}`);
  }


}
