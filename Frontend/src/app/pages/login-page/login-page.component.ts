import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {UsuarioMostrar} from '../../interfaces/UsuarioMostrar';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login-page.component.html',
  standalone: true,
})
export class LoginPageComponent implements OnInit{
  usuarios: UsuarioMostrar[] = []
  form!: FormGroup

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ){}

  ngOnInit(): void {
    this.obtenerUsuarios();

    this.form = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe((data: UsuarioMostrar[]) => {
      this.usuarios = data;
      console.log(this.usuarios)
    });
  }

  loginInvalido = false;

  onSubmit() {
    const identifier = this.form.get('identifier')?.value;
    const password = this.form.get('password')?.value;

    const body = { identifier, password };

    this.authService.login(body).subscribe({
      next: (response) => {
        console.log("Login exitoso", response);
        this.loginInvalido = false;

        if (response.usuario) {
          const idUsuario = response.usuario.idUsuario;

          this.usuarioService.getUsuarioById(idUsuario).subscribe((res: any) => {
            const usuario = res;

            console.log("Usuario completo recibido:", usuario);

            let rol: string | null = null;
            if (usuario.roles && Array.isArray(usuario.roles) && usuario.roles.length > 0) {
              rol = usuario.roles[0]?.rol?.RolName || null;
            }

            const ultimaSesion = usuario.sessions?.length
              ? usuario.sessions.sort(
                (a: any, b: any) =>
                  new Date(b.FechaIngreso).getTime() - new Date(a.FechaIngreso).getTime()
              )[0]
              : null;

            const usuarioCompleto = {
              idUsuario: usuario.idUsuario,
              UserName: usuario.UserName,
              Mail: usuario.Mail,
              Status: usuario.Status,
              SessionActive: usuario.SessionActive,
              Persona_idPersona2: usuario.Persona_idPersona2,
              Rol: rol,
              UltimaSesion: ultimaSesion,
              failedAttempts: usuario.failedAttempts || 0
            };

            localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));
            console.log('Guardado en localStorage:', usuarioCompleto);

            sessionStorage.setItem('desdeLogin', 'true');
            this.router.navigate(['/bienvenida']);
          });
        } else {
          console.error("UsuarioInterface data no encontrada en la respuesta.");
        }
      },
      error: (error) => {
        console.log("Login fallido", error);
        this.loginInvalido = true;
      },
    });
  }


}
