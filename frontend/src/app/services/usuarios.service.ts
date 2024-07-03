import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  añadirAlCarrito(producto_id: number, cantidad: number, usuario_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/añadirAlCarrito`, { producto_id, cantidad, usuario_id });
  }

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, password });
  }

  resetearPass(correo: string): Observable<any> {
    let passNueva:String = Math.random().toString(36).slice(-8);

    return this.http.post(`${this.apiUrl}/usuario/resetearPass`, { correo,password: passNueva });
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/register`, formData);
  }
  finalizarCompra(usuario_id: number, direccion: string, departamento: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/finalizarCompra`, { usuario_id, direccion, departamento });
  }

  eliminarDelCarrito(producto_id: number, cantidad: number, usuario_id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/eliminarDelCarrito`, { producto_id, cantidad, usuario_id });
  }

  checkEmail(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/checkEmail`, { correo });
  }

  isSessionStarted(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/isSessionStarted`);
  }

  getUserEmail(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/getUserEmail`);
  }
  getUserID(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/getUserID`);
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { withCredentials: true });
  }


}
