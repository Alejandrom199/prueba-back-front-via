import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.component.html',
  standalone: true,
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
  constructor(private usuarioService: UsuarioService){}

  ngOnInit(): void {
    this.obtenerUsuarios()
  }


  obtenerUsuarios(){
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      console.log({data})
    })
  }
}
