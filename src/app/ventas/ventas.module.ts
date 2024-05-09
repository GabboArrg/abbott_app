import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VentasPageRoutingModule } from './ventas-routing.module';
import { VentasPage } from './ventas.page';
import { SharedModule } from '../shared/shared.module'; // Importa el SharedModule aquí
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AgregarProductosComponent } from 'src/app/modals/agregar-productos-modal/agregar-productos.component';
import { AgregarAdjuntosComponent } from 'src/app/modals/agregar-adjuntos-modal/agregar-adjuntos.component';
import { VerFotoComponent } from 'src/app/modals/ver-foto-modal/ver-foto.component';
import { FormatDatePipe } from 'src/app/pipes/FormatDate.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentasPageRoutingModule,
    SharedModule // Asegúrate de importar SharedModule aquí
  ],
  declarations: [VentasPage, AgregarProductosComponent, AgregarAdjuntosComponent, FormatDatePipe, VerFotoComponent],
  providers: [FileTransfer, FileOpener, DatePipe]
})
export class VentasPageModule {}
