import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../components/header/header.component';
import { CrearProductoComponent } from './crear-producto/crear-producto.component';
import { ModificarProductoComponent } from './modificar-producto/modificar-producto.component';
import { EliminarProductoComponent } from './eliminar-producto/eliminar-producto.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [


    CrearProductoComponent,
    ModificarProductoComponent,
    EliminarProductoComponent,
    HeaderComponent,],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  constructor(

  ) {}

  ngOnInit(): void {

  }
}
