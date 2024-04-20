import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PedidosPageRoutingModule } from './pedidos-routing.module';
import { PedidosPage } from './pedidos.page';
import { SharedModule } from '../shared/shared.module';
import { ClienteModalComponent } from 'src/app/modals/cliente-modal/cliente-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPageRoutingModule,
    SharedModule
  ],
  declarations: [PedidosPage, ClienteModalComponent]
})
export class PedidosPageModule {}
