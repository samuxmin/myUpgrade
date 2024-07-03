import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { SectionProductsComponent } from './components/section-products/section-products.component'; // Importa el componente aquí
import { CarouselComponent } from './components/carousel/carousel.component';

import { FooterComponent } from './components/footer/footer.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { SharedService } from './services/shared.service';
import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    RouterOutlet,
    RegisterComponent,
    RouterLink,
    RouterLinkActive,
    SectionProductsComponent,
    CarouselComponent,
    FooterComponent,
    CategoriasComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  constructor(private sharedService: SharedService, private router: Router) {}

  currentRoute: string = ''; // currentRoute almacena la ruta actual, que se actualizará cada vez que cambie la navegación.

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      // Se suscribe a los eventos de navegación del enrutador.
      if (event instanceof NavigationEnd) {
        // Comprueba si el evento es una instancia de NavigationEnd, que indica el final de una navegación.
        this.currentRoute = event.urlAfterRedirects; // Si es así, actualiza currentRoute con la URL después de los redireccionamientos.
      }
    });

    const sessionId = this.authService.getSessionId();
    if (sessionId != null) {
      this.authService.sessionIsValid(sessionId).subscribe((data) => {
        console.log("data" + data.success + data.message);
        if (data) {
          if(!data.success){
            this.authService.clearSession();
          }
        }
      });
    }
    
  }
  navegate(): void {
    // Método navegate que llama al método navegate del servicio compartido.
    this.sharedService.navegate();
  }
  menuOption: string = '';
  onOption(menuOption: string): void {
    this.menuOption = menuOption;
    this.sharedService.onOption(menuOption);
  }
}
