import { Injectable, inject } from '@angular/core';
import { IProduct } from '../models/IProduct';
import { IProductCarrito } from '../models/IProductCarrito';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private authService = inject(AuthService);
  private cart: IProductCarrito[] = [];
  private sesionID: string | null = this.authService.getSessionId();
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  addToCart(product: IProductCarrito): void {
    this.cart.push(product);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    console.log("add to cart");
    this.http.post(`${this.apiUrl}/usuario/addToCart`, { producto_id: product.id, cantidad: product.cantidad , sesionID:this.sesionID }, { withCredentials: true }).subscribe((data) => {  console.log(data); });  
  }

  removeFromCart(product: IProductCarrito): void {
    const index = this.cart.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    this.http.post(`${this.apiUrl}/usuario/eliminarDelCarrito`, { producto_id: product.id, cantidad: product.cantidad , sesionID:this.sesionID }, { withCredentials: true }).subscribe((data) => {  console.log(data); });
  }
  deleteCartBD(){
    return this.http.post(`${this.apiUrl}/usuario/borrarCarrito`, {sesionID:this.sesionID }, { withCredentials: true }).subscribe((data) => {  console.log(data); });
  }
  getCart(): IProductCarrito[] {
    return this.cart;
  }

  getCartFromBD():Observable<any>{
    return this.http.post<IProductCarrito[]>(`${this.apiUrl}/usuario/getCart`,{sesionID:this.sesionID},{ withCredentials: true });
  }

  buyCart(){
    return this.http.post(`${this.apiUrl}/usuario/comprar`,{sesionID:this.sesionID},{ withCredentials: true })
  }

  setCartLS(cart: IProductCarrito[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  private cartItems: BehaviorSubject<IProductCarrito[]> = new BehaviorSubject<IProductCarrito[]>([]);
  

  get cart$() {
    return this.cartItems.asObservable();
  }
  
  isCartEmpty(): boolean {
    return this.cart.length === 0;
  }
  /*getCartLS(): IProductCarrito[] {
    console.log("carrito nuevo");
    const cart = localStorage.getItem('cart');
    console.log(cart);
    return cart ? JSON.parse(cart) : null;
  }*/
  

}
