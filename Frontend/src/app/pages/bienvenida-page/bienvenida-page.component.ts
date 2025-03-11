import {Component, inject, OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import {Usuario} from '../../interfaces/Usuario';
import {Router} from '@angular/router';


@Component({
  selector: 'app-bienvenida-page',
  imports: [],
  templateUrl: './bienvenida-page.component.html',
  standalone: true,
  styleUrl: './bienvenida-page.component.css'
})
export class BienvenidaPageComponent{
  usuario?: Usuario

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('usuario');
    if(userData){
      this.usuario = JSON.parse(userData);
      console.log("UsuarioInterface en Dashboard", this.usuario)
    }
  }

  navegarAlDashboard(){
    this.router.navigate(['dashboard'])
  }

}
