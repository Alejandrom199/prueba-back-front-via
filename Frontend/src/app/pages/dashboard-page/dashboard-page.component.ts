import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UsuarioMostrar} from '../../interfaces/UsuarioMostrar';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashboard-page.component.html',
  standalone: true,
})
export class DashboardPageComponent implements OnInit{

  usuarioStr: string | null = localStorage.getItem('usuario');
  userId:number = this.usuarioStr ? JSON.parse(this.usuarioStr).idUsuario : null;

  usuario?: UsuarioMostrar

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('usuario');
    if(userData){
      this.usuario = JSON.parse(userData);
      console.log("UsuarioInterface en Dashboard", this.usuario)
    }
  }

  cerrarSesion(): void {
    this.authService.logout(this.userId).subscribe({
      next: () => {
        localStorage.clear(); // o sessionStorage.clear()
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
      }
    });
  }

}
