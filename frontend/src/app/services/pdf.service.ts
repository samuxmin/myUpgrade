import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IProductCarrito } from '../models/IProductCarrito';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private pdfUrl = environment.pdfUrl;
  
  constructor(private http: HttpClient) { }

  downloadPdf(cart: IProductCarrito[]): Observable<Blob> {
    console.log("Datos enviados al backend: ", cart); 
    return this.http.post(`${this.pdfUrl}`, { cart }, { responseType: 'blob' });
    //Cuando haces una solicitud HTTP y especificas responseType: 'blob', le estás indicando al cliente HTTP de Angular que la respuesta 
    //esperada del servidor será en formato binario. Esto es útil para descargar archivos como PDFs, imágenes, documentos, etc.
  }
}
