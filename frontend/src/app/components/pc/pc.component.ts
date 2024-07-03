import { Component, inject } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import {  RouterModule } from '@angular/router';

@Component({
  selector: 'app-pc',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pc.component.html',
  styleUrl: './pc.component.css'
})
export class PcComponent {
  
  private prodService = inject(ProductosService); 
  public productos: any[] = []; // Declara una variable privada productos de tipo array
  ngOnInit(): void { // Método ngOnInit que implementa la interfaz OnInit
    this.prodService.listarPorCategoria("pc").subscribe((data: any[]) => { // Llama al método getProducts del servicio ApiService y se suscribe a los datos devueltos
      console.log(data); // Imprime los datos devueltos en la consola
      this.productos = data; // Asigna los datos devueltos a la variable productList
    });
  }
}
