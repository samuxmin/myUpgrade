import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModificarProductoService } from '../../../services/modificar-producto.service';
import Swal from 'sweetalert2';
import { IProduct } from '../../../models/IProduct';
import { ProductosService } from '../../../services/productos.service';

@Component({
  selector: 'admin-modificar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css'],
})
export class ModificarProductoComponent implements OnInit {
  contactForm!: FormGroup;
  foto: File | null = null;

  private prodService = inject(ProductosService);
  public productos = new Map<number, IProduct>();

  constructor(
    private formBuilder: FormBuilder,
    private modificarProductoService: ModificarProductoService
  ) {
    this.contactForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      precio: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      foto: [''],
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.foto = event.target.files[0];
      this.contactForm.patchValue({
        foto: this.foto,
      });
    }
  }

  enviar(event: Event) {
    event.preventDefault();
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append('id', this.contactForm.get('id')?.value);
      formData.append('nombre', this.contactForm.get('nombre')?.value);
      formData.append('stock', this.contactForm.get('stock')?.value);
      formData.append('precio', this.contactForm.get('precio')?.value);
      formData.append('categoria', this.contactForm.get('categoria')?.value);
      formData.append(
        'descripcion',
        this.contactForm.get('descripcion')?.value
      );
      if (this.foto) {
        formData.append('foto', this.foto);
      }

      this.modificarProductoService.modificarProducto(formData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡El producto se modificó de forma exitosa!',
          });
          this.contactForm.reset();
          this.foto = null;
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error en la Modificación',
            text: 'Hubo un problema al modificar el producto. Inténtelo nuevamente.',
          });
          console.log(error);
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error en la Modificación',
        text: 'Por favor, rellene todos los campos correctamente.',
      });
      console.log('Formulario inválido');
    }
  }

  ngOnInit(): void {
    this.prodService.listarProductos().subscribe((data: any[]) => {
      console.log(data);
      data.forEach((product) => {
        this.productos.set(product.id, product);
      });
    });


    this.contactForm.get('id')?.valueChanges.subscribe((productId) => {
      if (this.productos.has(productId)) {
        const product = this.productos.get(productId);
        this.contactForm.patchValue({
          nombre: product?.nombre,
          description: product?.descripcion,
          precio: product?.precio,
          stock: product?.stock,
          categoria: product?.categoria,
          descripcion: product?.descripcion,
        });

      } else {
        this.contactForm.patchValue({
          name: '',
          description: '',
          price: ''
        });
      }
    });
  }

  hasErrors(field: string, typeError: string) {
    return (
      this.contactForm.get(field)?.hasError(typeError) &&
      this.contactForm.get(field)?.touched
    );
  }

  llenarCamposOnChange() {
    let id = this.contactForm.get('id')?.value;
    console.log(id);
  }
}
