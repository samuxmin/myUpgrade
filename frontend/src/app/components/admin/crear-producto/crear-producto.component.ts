import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuarios.service';
import { CrearProductoService } from '../../../services/crear-producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'admin-crear-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent {
  contactForm!: FormGroup;
  foto: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private CrearProductoService: CrearProductoService
  ) {
    this.contactForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(1)]],
      precio: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      foto: ['',Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.foto = event.target.files[0];
      this.contactForm.patchValue({
        foto:this.foto
      });
    }
  }

  enviar(event: Event) {
    event.preventDefault();
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.contactForm.get('nombre')?.value);
      formData.append('stock', this.contactForm.get('stock')?.value);
      formData.append('precio', this.contactForm.get('precio')?.value);
      formData.append('categoria', this.contactForm.get('categoria')?.value);
      formData.append('descripcion', this.contactForm.get('descripcion')?.value);
      console.log(this.contactForm.get('nombre')?.value);
      if (this.foto) {
        formData.append('foto', this.foto);
      }
      else {
        formData.append('foto', new File([], ''));
      }

      this.CrearProductoService.crearProducto(formData).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡El producto se creo de forma exitosa!',
          });
          this.contactForm.reset();
          this.foto = null;
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error en el Registro',
            text: 'Hubo un problema al crear el producto. Inténtelo nuevamente.',
          });
          console.log(error);
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error en el Registro',
        text: 'Por favor, rellene todos los campos correctamente.',
      })
      console.log('Formulario inválido');
    }
  }

  ngOnInit(): void {

  }

  hasErrors(field: string, typeError: string) {
    return this.contactForm.get(field)?.hasError(typeError) && this.contactForm.get(field)?.touched;
  }
}
