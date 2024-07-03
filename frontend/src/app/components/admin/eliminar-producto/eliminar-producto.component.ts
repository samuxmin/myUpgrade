import { Component, inject } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { EliminarProductoService } from '../../../services/eliminar-producto.service';

@Component({
  selector: 'admin-eliminar-producto',
  standalone: true,
  imports: [CommonModule,RouterModule, FormsModule],
  templateUrl: './eliminar-producto.component.html',
  styleUrl: './eliminar-producto.component.css'
})

export class EliminarProductoComponent {
  constructor(private route: ActivatedRoute
    ,private eliminar: EliminarProductoService
  ) {


  }
  public quantities: { [key: string]: number } = {};
  private authService = inject(AuthService);
  private prodService = inject(ProductosService);
  public productos: any[] = [];
  public categoria:string | null = null;
  public imgUrl = environment.imgUrl;

  public eliminarProducto(id: number): void {
    if(this.eliminar.eliminarProducto(id).subscribe(data => {return data})){
    Swal.fire({
      icon: 'success',
      title: 'Producto Eliminado',
      showConfirmButton: false,
      timer: 1500
    });
    this.productos = this.productos.filter(producto => producto.id !== id);
  }else{
      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar producto',
        showConfirmButton: false,
        timer: 1500
      });

    }
  }
  public isLogged(): boolean {
    return this.authService.isLogged();

  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.categoria = data['categoria'];
      if (this.categoria) {
        this.prodService.listarPorCategoria(this.categoria).subscribe((data: any[]) => {
          console.log(data);
          this.productos = data;
        });
      } else {
        this.prodService.listarProductos().subscribe((data: any[]) => {
          console.log(data);
          this.productos = data;
          this.initializeQuantities();
        });
      }
    });
  }

  private initializeQuantities(): void {
    this.productos.forEach(product => {
      this.quantities[product.id] = 1;
    });
  }
  public decrementQuantity(productId: string): void {
    this.quantities[productId] = Math.max(this.quantities[productId] - 1, 1);
  }

  public confirmar(id: number): void{

    Swal.fire({
      title: "¿Eliminar Producto?",
      text: "¡No podrás revertir esta accion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarProducto(id);
      }
    });

  }
}

