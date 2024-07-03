

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  enviarEmail(correo: string, message: string): Observable<any> {
    //console.log(correo,message,"Servicio");
    
    console.log(correo, ": Servicio");
    // console.log(this.http.post<any>(this.apiUrl,body));
    console.log("Fin service");
    console.log(this.apiUrl);
   // return this.http.post<any>(`${this.apiUrl}/contact`,{correo, message});
    return this.http.post(`${this.apiUrl}/usuario/resetearPass`, { correo,password: message});
  }
}

