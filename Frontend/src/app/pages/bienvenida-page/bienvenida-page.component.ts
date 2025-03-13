import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsuarioMostrar} from '../../interfaces/UsuarioMostrar';


@Component({
  selector: 'app-bienvenida-page',
  imports: [],
  templateUrl: './bienvenida-page.component.html',
  standalone: true,
})
export class BienvenidaPageComponent implements OnInit{
  usuario?: UsuarioMostrar

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
