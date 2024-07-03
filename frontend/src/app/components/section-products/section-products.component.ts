import { Component, inject, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { IProduct } from '../../models/IProduct';
import { IProductCarrito } from '../../models/IProductCarrito';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-section-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './section-products.component.html',
  styleUrl: './section-products.component.css',
})
export class SectionProductsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private sharedService: SharedService) {}
  public quantities: { [key: string]: number } = {};
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private prodService = inject(ProductosService);
  public productos: any[] = [];
  public categoria: string | null = null;
  public imgUrl = environment.imgUrl;
  public searchText: string | null = null;
  public isAdmin: boolean = false;


  public addToCart(id: number): void {
    const cantidad = this.quantities[id] || 1;
    let productoCarrito: IProductCarrito = {
      id: id,
      nombre: '',
      precio: 0,
      imagen: '',
      cantidad: cantidad,
      stock: 0,
    };
    Swal.fire({
      icon: 'success',
      title: 'Añadido al carrito',
      showConfirmButton: false,
      timer: 1500,
    });
    this.cartService.addToCart(productoCarrito);
  }

  public isLogged(): boolean {
    return this.authService.isLogged();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.categoria = data['categoria'];
    });

    this.route.queryParams.subscribe(params => {
      this.searchText = params['search'];
      this.loadProducts();
    });

    this.isAdmin = this.sharedService.checkAdmin();

  }

  private loadProducts(): void {
    if (this.searchText) {
      this.prodService.buscarProducto(this.searchText).subscribe((data: any[]) => {
        console.log(data);
        this.productos = data;
        this.productos = this.productos.filter((product) => product.stock > 0);
        this.initializeQuantities();
      });
    } else if (this.categoria) {
      this.prodService.listarPorCategoria(this.categoria).subscribe((data: any[]) => {
        console.log(data);
        this.productos = data;
        this.productos = this.productos.filter((product) => product.stock > 0);
        this.initializeQuantities();
      });
    } else {
      this.prodService.listarProductos().subscribe((data: any[]) => {
        console.log(data);
        this.productos = data;
        this.productos = this.productos.filter((product) => product.stock > 0);
        this.initializeQuantities();
      });
    }
  }

  private initializeQuantities(): void {
    this.productos.forEach((product) => {
      this.quantities[product.id] = 1;
    });
  }

  public decrementQuantity(productId: string): void {
    this.quantities[productId] = Math.max(this.quantities[productId] - 1, 1);
  }
}
