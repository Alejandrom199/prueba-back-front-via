import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {UsuarioLogin} from '../../interfaces/UsuarioLogin';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Usuario} from '../../interfaces/Usuario';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login-page.component.html',
  standalone: true,
})
export class LoginPageComponent implements OnInit{
  usuarios: Usuario[] = []
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
    this.usuarioService.obtenerUsuarios().subscribe((data: Usuario[]) => {
      this.usuarios = data;
      console.log(this.usuarios)
    });
  }

  loginInvalido = false;

  onSubmit() {
    const identifier = this.form.get('identifier')?.value;
    const password = this.form.get('password')?.value;

    const body = {identifier, password}

    this.authService.login(body).subscribe({
      next: (response) => {
        console.log("Login exitoso", response);
        this.loginInvalido = false;

        if(response.usuario){
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
        else{
          console.error("UsuarioInterface data no encontrada en la respuesta.")
        }

        //Redirigir al dashboard
        this.router.navigate(['index'])
      },
      error: (error) => {
          console.log("Login fállido", error)
          this.loginInvalido = true;
      }
    })
  }

}
