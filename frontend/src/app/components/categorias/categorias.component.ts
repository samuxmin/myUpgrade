import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})

export class CategoriasComponent {
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    // Este método se ejecutaría al inicializar el componente, pero está vacío en este caso
  }

  navegate(): void {
    this.sharedService.navegate();
  }

  menuOption: string = '';

  onOption(menuOption: string): void {
    this.menuOption = menuOption;
    this.sharedService.onOption(menuOption);
  }

}
