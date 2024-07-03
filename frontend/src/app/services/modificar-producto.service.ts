import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModificarProductoService {
  private apiUrl = environment.apiUrl;
  sesionID = localStorage.getItem('sesionID');

  constructor(private http: HttpClient) {}

  modificarProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/modificarProducto`, formData, { withCredentials: true });
  }
}
