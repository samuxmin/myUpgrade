import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IProductCarrito } from '../../models/IProductCarrito';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(private pdfService: PdfService, private router: Router) {}

  public total = 0;
  public imgUrl = environment.imgUrl;
  public quantities: { [key: string]: number } = {};
  private cartService = inject(CartService);
  public cart: IProductCarrito[] = [];
  private stocks: { [key: string]: number } = {};

  ngOnInit(): void {
    this.cartService.getCartFromBD().subscribe((data: any[]) => {
      this.cart = data;

      if (this.cart.length === 0) {
        this.showEmptyCartAlert();
      } else {
        this.initializeQuantities();
        this.cartService.setCartLS(this.cart);
        console.log('Carrito cargado: ', this.cart);
      }
    });

  }

  private initializeQuantities(): void {
    this.cart.forEach((product) => {
      this.quantities[product.id] = product.cantidad - 0;
      this.stocks [product.id] = product.stock;
    });
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
    if(this.quantities[productId] == this.stocks[productId]){
      Swal.fire({
        text: "Máximo stock alcanzado",
        icon: "info"
      });
      return;
    }
    this.quantities[productId] = this.quantities[productId] + 1;

    const productInCart = this.cart.find(product => product.id === productId);
    if (productInCart) {
        productInCart.cantidad = this.quantities[productId];
    }
    
    this.addToCart(productId);
  }

  public addToCart(id: number): void {
    let productoCarrito: IProductCarrito = {
      id: id,
      nombre: '',
      precio: 0,
      imagen: '',
      cantidad: 1,
      stock:0
    };
    this.cartService.addToCart(productoCarrito);
  }

  public decreaseFromCart(id: number): void {
    let productoCarrito: IProductCarrito = {
      id: id,
      nombre: '',
      precio: 0,
      imagen: '',
      cantidad: 1,
      stock:0
    };
    this.cartService.removeFromCart(productoCarrito);
  }

  public deleteFromCart(id: number): void {
    let productoCarrito: IProductCarrito = {
      id: id,
      nombre: '',
      precio: 0,
      imagen: '',
      cantidad: this.quantities[id],
      stock:0
    };
    this.cartService.removeFromCart(productoCarrito);
    this.cart = this.cart.filter((product) => product.id !== id);
    delete this.quantities[id];

    if (this.cart.length === 0) {
      this.showEmptyCartAlert();
    }
  }

  public getTotal(): number {
    this.total = 0;
    for (const product of this.cart) {
      this.total += product.precio * this.quantities[product.id];
    }
    return this.total;
  }

  public buy(): void {}

  downloadPdf() {
    if (this.cart.length === 0) {
      console.log('El carrito está vacío');
      return;
    }
    this.pdfService.downloadPdf(this.cart).subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'archivo.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  buyAndDownload() {
    this.cartService.buyCart().subscribe((data) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: 'Compra realizada con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        this.downloadPdf();
        this.cart = [];
        this.quantities = {};
        this.total = 0;
        this.cartService.setCartLS(this.cart);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al realizar la compra',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  private showEmptyCartAlert(): void {
    Swal.fire({
      icon: 'info',
      title: 'El carrito está vacío',
      showConfirmButton: true,
    }).then(() => {
      this.router.navigate(['/']); // Redirigir a la página principal
    });
  }
}
