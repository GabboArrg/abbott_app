import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic
import { HeaderComponent } from './header/header.component';
import { Comma2DecimalPipe } from 'src/app/pipes/comma2decimal.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    Comma2DecimalPipe
  ],
  imports: [
    CommonModule,
    IonicModule // Agrega el módulo de Ionic aquí
  ],
  exports: [
    HeaderComponent,
    Comma2DecimalPipe
  ]
})
export class SharedModule { }
