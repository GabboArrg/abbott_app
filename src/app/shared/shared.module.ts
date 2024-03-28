import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic

import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule // Agrega el módulo de Ionic aquí
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
