import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsuarioService} from '../../../services/usuario.service';
import * as XLSX from 'xlsx';
import {CommonModule} from '@angular/common';
import {UsuarioMostrar} from '../../../interfaces/UsuarioMostrar';


@Component({
  selector: 'app-mantenimiento-usuarios-page',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './mantenimiento-usuarios-page.component.html',
  standalone: true,
})
export class MantenimientoUsuariosPageComponent implements OnInit{
  usuarios: UsuarioMostrar[] = [];
  usuarioSeleccionado?: UsuarioMostrar;
  usuarioForm: FormGroup;
  filtroNombre: string = '';
  isAdmin: boolean = true;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.usuarioForm = this.fb.group({
      UserName: [''],
      Mail: ['']
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  handleFileUpload(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const usuariosExcel = XLSX.utils.sheet_to_json(sheet);
      console.log('Usuarios cargados:', usuariosExcel);
      // Aquí podrías enviar los usuarios al backend si deseas cargarlos automáticamente
    };

    reader.readAsArrayBuffer(file);
  }

  cambiarEstado(usuario: any): void {
    if (this.isAdmin) {
      // Aquí envías el nuevo estado al backend si deseas persistir
      console.log('Cambio de estado:', usuario);
    }
  }

  editarUsuario(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.usuarioForm.patchValue({
      UserName: usuario.UserName,
      Mail: usuario.Mail
    });
  }

  guardarEdicion(): void {
    if (this.usuarioForm.valid && this.usuarioSeleccionado) {
      const updated = {
        ...this.usuarioSeleccionado,
        ...this.usuarioForm.value
      };

      this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.idUsuario, updated)
        .subscribe({
          next: (res) => {
            console.log('Usuario actualizado:', res);
            this.usuarioSeleccionado = undefined;
            this.cargarUsuarios();
          },
          error: (err) => {
            console.error('Error al actualizar usuario:', err);
          }
        });
      // Aquí podrías enviar los cambios al backend
      console.log('Usuario actualizado:', updated);
      //this.usuarioSeleccionado = null;
      this.cargarUsuarios();
    }
  }

  buscar(): void {
    if (this.filtroNombre.trim() !== '') {
      this.usuarios = this.usuarios.filter(u => u.UserName.toLowerCase().includes(this.filtroNombre.toLowerCase()));
    } else {
      this.cargarUsuarios();
    }
  }
}
