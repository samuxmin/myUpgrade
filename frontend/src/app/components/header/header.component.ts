import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { IProductCarrito } from '../../models/IProductCarrito';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public foto: string | null = null;
  public image: string = './assets/img/user-icon.png';
  public usrImgUrl = environment.usrImgUrl;
  public cart: IProductCarrito[] = [];

  public sessionIdString: string | null = localStorage.getItem('sessionId');
  public isAdmin: boolean = false;

  currentRoute: string = this.router.url;
  menuOption: string = '';
  searchText: string = '';

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private viewportScroller: ViewportScroller,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cartService: CartService,
    private productosService: ProductosService
  ) {}

  onSearch() {
    if (this.searchText.trim()) {
      this.productosService.buscarProducto(this.searchText).subscribe(
        (results) => {
          this.router.navigate(['/producto'], { queryParams: { search: this.searchText } });
        },
        (error) => {
          console.error('Error en la búsqueda:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error en la búsqueda',
            text: 'Ocurrió un error al buscar productos. Por favor, intenta nuevamente.',
          });
        }
      );
    }
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    this.sharedService.getLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadUserImage();
        this.loadAdminStatus();
      }
    });

    this.sharedService.getAdminStatus().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    if (this.isLogged()) {
      this.loadUserImage();
      this.loadAdminStatus();
    }
  }

  isLogged(): boolean {
    return this.authService.getSessionId() != null;
  }


  navigate(): void {
    this.sharedService.navegate();
  }

  onOption(menuOption: string): void {
    this.menuOption = menuOption;
    this.sharedService.onOption(menuOption);
  }

  scrollToFooter() {
    this.viewportScroller.scrollToAnchor('footer');
  }

  isProductoRoute(): boolean {
    return this.currentRoute.includes('/producto');
  }

  logout() {
    this.authService.logout(JSON.stringify(this.authService.getSessionId())).subscribe(
      (response) => {
        if (response.success) {
          this.authService.clearSession();
          Swal.fire({
            icon: 'success',
            title: '¡Logout Exitoso!',
            text: 'Has cerrado sesión correctamente.',
          }).then(() => {
            this.image = '/assets/img/user-icon.png';
            this.sharedService.onOption('/login');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Fallo logout',
            text: response.message || 'Logout fallido.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el servidor',
          text: 'Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.',
        });
      }
    );
  }

  loadUserImage() {
    const sessionId = this.authService.getSessionId();
    if (sessionId) {
      this.authService.getImagen(sessionId).subscribe(
        (data) => {
          console.log('Imagen obtenida:', data);
          if (data && data.success) {
            if (data.foto) {
              this.image = data.foto;
              this.image = this.usrImgUrl + this.image;
            }
          }
        },
        (error) => {
          console.error('Error al obtener la imagen:', error);
          this.image = './assets/img/user-icon.png';
        }
      );
    }
  }

  loadAdminStatus(): void {
    const isAdminString = localStorage.getItem('isAdmin');
    console.log('isAdminString:', isAdminString);
    if (isAdminString !== null) {
      this.isAdmin = JSON.parse(isAdminString);
    }
  }
}
