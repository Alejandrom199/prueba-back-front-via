import {Component, OnInit} from '@angular/core';
import {Usuario} from '../../interfaces/Usuario';
import {AdminPageComponent} from './admin-page/admin-page.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [AdminPageComponent],
  templateUrl: './dashboard-page.component.html',
  standalone: true,
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit{

  usuario?: Usuario

  ngOnInit(): void {
    const userData = localStorage.getItem('usuario');
    if(userData){
      this.usuario = JSON.parse(userData);
      console.log("UsuarioInterface en Dashboard", this.usuario)
    }
  }

}
