import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  contactForm!: FormGroup;
  foto: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.contactForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      apellido: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      foto: ['']
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.foto = event.target.files[0];
      this.contactForm.patchValue({
        foto: this.foto
      });
    }
  }

  enviar(event: Event) {
    event.preventDefault();
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.contactForm.get('nombre')?.value);
      formData.append('apellido', this.contactForm.get('apellido')?.value);
      formData.append('correo', this.contactForm.get('correo')?.value);
      formData.append('password', this.contactForm.get('password')?.value);
      if (this.foto) {
        formData.append('foto', this.foto);
      }
      else {
        formData.append('foto', new File([], ''));
      }
      this.usuarioService.checkEmail(this.contactForm.get('correo')?.value).subscribe(
        response => {
          if (response.exists) {
            Swal.fire({
              icon: 'error',
              title: 'Correo ya registrado',
              text: 'El correo ya está registrado. Use otro correo.',
            });
          } else {
            this.usuarioService.register(formData).subscribe(
              response => {
                Swal.fire({
                  icon: 'success',
                  title: '¡Registro Exitoso!',
                  text: 'El usuario ha sido registrado correctamente.',
                });
                this.contactForm.reset();
                this.foto = null;
              },
              error => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error en el Registro',
                  text: 'Hubo un problema al registrar el usuario. Inténtelo nuevamente.',
                });
              }
            );
          }
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Hubo un problema al validar el correo. Inténtelo nuevamente.',
          });
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  ngOnInit(): void {

  }

  hasErrors(field: string, typeError: string) {
    return this.contactForm.get(field)?.hasError(typeError) && this.contactForm.get(field)?.touched;
  }
}
