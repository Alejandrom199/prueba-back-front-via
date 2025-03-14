import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../services/usuario.service';
import {UsuarioMostrar} from '../../../interfaces/UsuarioMostrar';

@Component({
  selector: 'app-admin-page',
  imports: [],
  templateUrl: './admin-page.component.html',
  standalone: true,
})
export class AdminPageComponent implements OnInit{

  usuarios?: UsuarioMostrar[]

  usuariosActivos: number = 0;
  usuariosInactivos: number = 0;
  usuariosBloqueados: number = 0;
  totalIntentosFallidos: number = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log("Usuarios recibidos:", this.usuarios);
        this.calcularEstadisticas();
      },
      error: (err) => {
        console.error("Error al obtener usuarios", err);
      }
    });
  }


  calcularEstadisticas(): void {
    if (!this.usuarios) return;

    this.usuariosActivos = this.usuarios.filter(u => u.SessionActive === 'S').length;
    this.usuariosInactivos = this.usuarios.filter(u => u.SessionActive === 'N').length;
    this.usuariosBloqueados = this.usuarios.filter(u => u.Status === 'bloqueado' || u.failedAttempts >= 3).length;
    this.totalIntentosFallidos = this.usuarios.reduce((sum, u) => sum + (u.failedAttempts || 0), 0);
  }

}
