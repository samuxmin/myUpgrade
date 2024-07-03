import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EliminarProductoService {
  private apiUrl = environment.apiUrl;
  sesionID = localStorage.getItem('sesionID');

  constructor(private http: HttpClient) {}

  eliminarProducto(id: number): Observable<any> {
    console.log("eliminando producto con id: "+id);
    return this.http.post(`${this.apiUrl}/admin/eliminarProducto`, id, { withCredentials: true });
  }

}
