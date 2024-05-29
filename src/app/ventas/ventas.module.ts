import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VentasPageRoutingModule } from './ventas-routing.module';
import { VentasPage } from './ventas.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { AgregarProductosComponent } from 'src/app/modals/agregar-productos-modal/agregar-productos.component';
import { AgregarAdjuntosComponent } from 'src/app/modals/agregar-adjuntos-modal/agregar-adjuntos.component';
import { VerFotoComponent } from 'src/app/modals/ver-foto-modal/ver-foto.component';
import { FormatDatePipe } from 'src/app/pipes/FormatDate.pipe';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import {Camera} from '@awesome-cordova-plugins/camera/ngx';
import { DespachoComponent } from 'src/app/modals/despacho-modal/despacho-modal.component';
import { CrearDespachoComponent } from 'src/app/modals/crear-despacho-modal/crear-despacho-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VentasPageRoutingModule,
    SharedModule
  ],
  declarations: [VentasPage, AgregarProductosComponent, AgregarAdjuntosComponent, 
      FormatDatePipe, VerFotoComponent, DespachoComponent,CrearDespachoComponent],
  providers: [FileTransfer, FileOpener, DatePipe,FilePath,FileChooser, Camera]
})
export class VentasPageModule {}
