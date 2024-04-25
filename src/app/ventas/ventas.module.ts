import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VentasPageRoutingModule } from './ventas-routing.module';
import { VentasPage } from './ventas.page';
import { SharedModule } from '../shared/shared.module';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AgregarProductosComponent } from 'src/app/modals/agregar-productos-modal/agregar-productos.component';
import { AgregarAdjuntosComponent } from 'src/app/modals/agregar-adjuntos-modal/agregar-adjuntos.component';
import { Comma2DecimalPipe } from 'src/app/pipes/comma2decimal.pipe';
import { FormatDatePipe } from 'src/app/pipes/FormatDate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentasPageRoutingModule,
    SharedModule
  ],
  declarations: [VentasPage,AgregarProductosComponent,AgregarAdjuntosComponent,Comma2DecimalPipe,FormatDatePipe],
  providers: [FileTransfer,FileOpener]
})
export class VentasPageModule {}
