import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { SectionProductsComponent } from './components/section-products/section-products.component';
import { RegisterComponent } from './components/register/register.component';
import { ModificarComponent } from './components/modificar/modificar.component';
import { CartComponent } from './components/cart/cart.component';
import { FooterComponent } from './components/footer/footer.component';
import { CrearProductoComponent } from './components/admin/crear-producto/crear-producto.component';
import { ModificarProductoComponent } from './components/admin/modificar-producto/modificar-producto.component';
import { EliminarProductoComponent } from './components/admin/eliminar-producto/eliminar-producto.component';
import { AdminComponent } from './components/admin/admin.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'modificar', component: ModificarComponent},
    { path: 'producto', component: SectionProductsComponent },
    { path: 'producto/pc', component: SectionProductsComponent, data: { categoria: 'pc' } },
    { path: 'producto/componentes', component: SectionProductsComponent , data: { categoria: 'componentes' }},
    { path: 'producto/perifericos', component: SectionProductsComponent, data: { categoria: 'perifericos' } },
    { path: 'producto/notebooks', component: SectionProductsComponent, data: { categoria: 'notebooks' } },
    { path: 'carrito', component: CartComponent},
    { path: 'producto/:id', component: ProductInfoComponent },
    { path: 'contact', component: FooterComponent },
    {path:'admin',component:AdminComponent},
    {path:'admin/crearproducto',component:CrearProductoComponent},
    { path: 'admin/modificarproducto', component: ModificarProductoComponent},
    {path: 'admin/eliminarproducto', component: EliminarProductoComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
