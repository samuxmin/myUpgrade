import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IProduct } from '../../models/IProduct';
import { environment } from '../../../environments/environment';
import { IProductCarrito } from '../../models/IProductCarrito';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit{
  constructor(private route: ActivatedRoute, private sharedService: SharedService) {}
  public imgUrl = environment.imgUrl;
  private _route = inject(ActivatedRoute);
  private _apiService = inject(ProductosService);
  public product?: IProduct;
  public loading = true;
  public quantities: { [key: number]: number } = {};
  private cartService = inject(CartService);
  public cart: IProductCarrito[] = [];
  private authService = inject(AuthService);
  public isAdmin: boolean = false;

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this._apiService.infoProducto(params['id']).subscribe((data) => {
        console.log(data);
        this.product = <IProduct>data;
        if (this.product && this.product.id) {
          this.quantities[this.product.id] = 1; // Inicializa la cantidad
        }
        console.log("La categoría del producto es: " + this.product.categoria);
        this.loading = false;
      });
    });
    this.isAdmin = this.sharedService.checkAdmin();
  }

  public decrementQuantity(productId: number): void {
    if (this.quantities[productId] <= 1) {
      this.cart = this.cart.filter((product) => product.id !== productId);
      delete this.quantities[productId];
    } else {
      this.quantities[productId] = Math.max(this.quantities[productId] - 1, 1);
    }
    this.decreaseFromCart(productId);
  }

  public increaseQuantity(productId: number): void {
    this.quantities[productId] = this.quantities[productId] + 1;
    this.addToCart(productId);
  }

  public addToCart(id: number): void {
    if (!this.product) return;

    let productoCarrito: IProductCarrito = {
      id: id,
      nombre: this.product.nombre,
      precio: this.product.precio,
      imagen: this.product.imagen,
      cantidad: this.quantities[id] || 1,
      stock:0
    };
    Swal.fire({
      icon: 'success',
      title: 'Añadido al carrito',
      showConfirmButton: false,
      timer: 1500
    });
    this.cartService.addToCart(productoCarrito);
  }

  public decreaseFromCart(id: number): void {
    if (!this.product) return;

    let productoCarrito: IProductCarrito = {
      id: id,
      nombre: this.product.nombre,
      precio: this.product.precio,
      imagen: this.product.imagen,
      cantidad: this.quantities[id] || 1,
      stock:0
    };
    this.cartService.removeFromCart(productoCarrito);
  }
  public isLogged(): boolean {
    return this.authService.isLogged();
  }
}
