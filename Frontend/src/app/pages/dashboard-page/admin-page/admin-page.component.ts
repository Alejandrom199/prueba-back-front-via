import {Component, OnInit} from '@angular/core';
import {Usuario} from '../../../interfaces/Usuario';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
  selector: 'app-admin-page',
  imports: [],
  templateUrl: './admin-page.component.html',
  standalone: true,
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit{

  usuarios?: Usuario[]

  usuariosActivos: number = 0;
  usuariosInactivos: number = 0;
  usuariosBloqueados: number = 0;
  totalIntentosFallidos: number = 0;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data
    })

    this.calcularEstadisticas()
  }

  calcularEstadisticas(): void {
    if (!this.usuarios) return;

    this.usuariosActivos = this.usuarios.filter(u => u.SessionActive === 'S').length;
    this.usuariosInactivos = this.usuarios.filter(u => u.SessionActive === 'N').length;
    this.usuariosBloqueados = this.usuarios.filter(u => u.Status === 'bloqueado' || u.failedAttempts >= 3).length;
    this.totalIntentosFallidos = this.usuarios.reduce((sum, u) => sum + (u.failedAttempts || 0), 0);
  }

}
