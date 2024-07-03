import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listarProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/listar`);
  }

  buscarProducto(texto: string, filtro?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos/buscarProducto`, { texto, filtro });
  }
  
  infoProducto(id:string){
    return this.http.post(`${this.apiUrl}/productos/infoProducto`, { id });
  }

  listarPorCategoria(categoria: string):Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/${categoria}`);
  }

}