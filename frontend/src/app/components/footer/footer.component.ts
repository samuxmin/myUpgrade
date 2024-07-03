import { Component } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  correo: string = '';
  message: string = '';

  constructor(private emailService: EmailService,  private sharedService: SharedService,) {}

  enviarEmail() {
    console.log(this.correo,"2");
    this.emailService.enviarEmail (JSON.stringify("facundo2816@gmail.com"), JSON.stringify(this.message)).subscribe(
      response => {
      console.log(response.correo,"Valor");
      if (response) {
        console.log(this.correo,"3");
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Correo',
          text: 'Correo enviado correctamente',
        });
      } else {
        console.log(this.correo,"4");
        console.log(response);
        alert('Error al enviar el email: ' + (response ? response.message : 'No response from server'));
      }
    });
  }
  ngOnInit(): void {
    // Este método se ejecutaría al inicializar el componente, pero está vacío en este caso
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
