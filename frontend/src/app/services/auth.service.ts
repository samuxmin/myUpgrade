import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private sessionIdKey = 'sessionId';

  constructor(private http: HttpClient) { }

  login(correo: string, password: string): Observable<any> {
    console.log("el correo es:"+correo);
    return this.http.post(`${this.apiUrl}/login`, { correo, password }, { withCredentials: true });
  }

  isLogged(): boolean {
    return this.getSessionId() !== null;
  }

  logout(sesionID : string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`,{sesionID}, { withCredentials: true });
  }

  modificarUsuario(nombre: string, apellido: string, password: string, sesionID : string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/modificar`, { nombre, apellido, password, sesionID }, { withCredentials: true });
  }

  setSessionId(sessionId: string): void {
    localStorage.setItem(this.sessionIdKey, JSON.stringify(sessionId));
  }

  getSessionId(): string | null {
    return localStorage.getItem(this.sessionIdKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.sessionIdKey);
  }

  getImagen(sesionID : string): Observable<any> {
    console.log("LLegaImagen");
    return this.http.post<{ success: boolean; foto: string }>(`${this.apiUrl}/imagen`,{sesionID}, { withCredentials: true });
  }

  sessionIsValid(sesionID : string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sesion`,{sesionID}, { withCredentials: true });
  }

  IsAdmin(sessionId: string): Observable<boolean> {
    console.log("IsAdmin ",sessionId);
    return this.http.post<boolean>(`${this.apiUrl}/isadmin`, { sessionId }, { withCredentials: true });
  }

  setAdminStatus(sessionId: string, isAdmin: boolean): void {
    console.log('se esta poniendo en la sesion:', isAdmin);
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }
}
