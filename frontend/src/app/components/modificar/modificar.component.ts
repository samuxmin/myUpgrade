import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modificar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificar.component.html',
  styleUrl: './modificar.component.css'
})
export class ModificarComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private sharedService: SharedService,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      password: ['', Validators.minLength(6)]
    });
  }

  actualizarUsuario(event: Event) {
    event.preventDefault();

    if(this.authService.getSessionId() != null){
    if (this.form.valid) {
     
        const { nombre, apellido, password } = this.form.value;
        this.authService.modificarUsuario(nombre, apellido, password,JSON.stringify(this.authService.getSessionId())).subscribe(
            response => {
                if (response.success) { 
                    Swal.fire({
                        icon: 'success',
                        title: 'Modificar Exitoso!',
                        text: 'El usuario ha sido modificado correctamente.',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en la modificación',
                        text: response ? response.message : 'Hubo un problema al modificar el usuario. Inténtelo nuevamente1.',
                    });
                }
            },
            error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la modificación',
                    text: 'Hubo un problema al modificar el usuario. Inténtelo nuevamente2.',
                });
            }
        );
    }
  }
  else{
    Swal.fire({
      icon: 'error',
      title: 'Error en la modificación',
      text: 'Hay que estar logeado para modificar un usuario.',
  });
  }
}

  

  ngOnInit(): void { // Método ngOnInit que implementa la interfaz OnInit
    // Este método se ejecutaría al inicializar el componente, pero está vacío en este caso
  }

  hasErrors(field: string, typeError: string) { // Método hasErrors que recibe dos parámetros: el nombre del campo y el tipo de error
    return this.form.get(field)?.hasError(typeError) && this.form.get(field)?.touched;
    // Retorna true si el campo tiene el error especificado y ha sido tocado por el usuario, de lo contrario retorna false
  }
  navegate(): void {
    this.sharedService.navegate();
  }

  menuOption: string = '';

  onOption(menuOption: string): void {
    this.menuOption = menuOption;
    this.sharedService.onOption(menuOption);
  }

}