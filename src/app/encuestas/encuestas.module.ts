import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EncuestasPageRoutingModule } from './encuestas-routing.module';
import { EncuestasPage } from './encuestas.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestasPageRoutingModule,
    SharedModule
  ],
  declarations: [EncuestasPage]
})
export class EncuestasPageModule {}
