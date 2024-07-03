import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasSession());
  private isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkAdmin());

  constructor(private router: Router) { }

  navegate(): void {
    this.router.navigate(['/login']);
    this.router.navigate(['/register']);
    this.router.navigate(['/modificar']);
    this.router.navigate(['/producto']);
    this.router.navigate(['/producto/perifericos']);
    this.router.navigate(['/producto/pc']);
    this.router.navigate(['/producto/notebooks']);
    this.router.navigate(['/producto/componentes']);
    this.router.navigate(['/']);
    this.router.navigate(['/contact']);
  }

  private hasSession(): boolean {
    return localStorage.getItem('sessionId') !== null;
  }

  checkAdmin(): boolean {
    const isAdminString = localStorage.getItem('isAdmin');
    return isAdminString ? JSON.parse(isAdminString) : false;
  }

  setLoggedIn(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  getLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setAdminStatus(isAdmin: boolean): void {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
    this.isAdminSubject.next(isAdmin);
  }

  getAdminStatus(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  onOption(menuOption: string): void {
    this.router.navigate([menuOption]);
  }
}
