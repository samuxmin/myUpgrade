import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass, RegisterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  contactForm!: FormGroup;
  ;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {
    this.contactForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  resetPass(){
    Swal.fire({
      title: "Ingresa tu correo",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Resetear contraseña",
      showLoaderOnConfirm: true,
      preConfirm: async (mail) => {
        this.usuarioService.resetearPass(mail).subscribe(response=>{
          console.log(response );
          if(response.success){
            Swal.fire({
              icon: 'success',
              title: '¡Contraseña reseteada!',
              text: `Se ha enviado un correo con la nueva contraseña.`,
            });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'Correo no encontrado.',
            });
          }
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
    });
  }

  enviar(event: Event) {
    event.preventDefault();
    console.log('Evento de envío del formulario:', event);
    if (!this.authService.isLogged()) {
      if (this.contactForm.valid) {
        const { correo, password } = this.contactForm.value;
        this.authService.login(correo, password).subscribe(
          response => {
            if (response.success) {
            this.authService.IsAdmin(response.user.id).subscribe(
                adminResponse => {
                  const isAdmin = adminResponse;
                  console.log('isAdmin resultado:', isAdmin);
                  this.authService.setAdminStatus(response, isAdmin);
                  this.sharedService.setLoggedIn(true);
                  this.sharedService.setAdminStatus(isAdmin);
                  Swal.fire({
                    icon: 'success',
                    title: '¡Login Exitoso!',
                    text: 'Has iniciado sesión correctamente.',
                  }).then(() => {
                    this.router.navigate(['/']); // Navegar a la página de inicio
                  });
                },
              )
              this.authService.setSessionId(response);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error de autenticación',
                text: response.message || 'Correo o contraseña incorrectos.',
              });
            }
          },
          error => {
            Swal.fire({
              icon: 'error',
              title: 'Error en el servidor',
              text: 'Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.',
            });
          }
        );
      }
      event.stopPropagation();
    }
  }



  ngOnInit(): void { // Método ngOnInit que implementa la interfaz OnInit
    // Este método se ejecutaría al inicializar el componente, pero está vacío en este caso
  }

  hasErrors(field: string, typeError: string) { // Método hasErrors que recibe dos parámetros: el nombre del campo y el tipo de error
    return this.contactForm.get(field)?.hasError(typeError) && this.contactForm.get(field)?.touched;
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
