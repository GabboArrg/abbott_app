import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientesPageRoutingModule } from './clientes-routing.module';
import { ClientesPage } from './clientes.page';
import { SharedModule } from '../shared/shared.module';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { AgregarDireccionComponent } from 'src/app/modals/agregar-direccion-modal/agregar-direccion.component';
import { AgregarContactoComponent } from 'src/app/modals/agregar-contacto-modal/agregar-contacto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    SharedModule
  ],
  declarations: [ClientesPage,AgregarDireccionComponent,AgregarContactoComponent],
  providers: [Camera,ImagePicker,FileTransfer,FileOpener,FilePath,FileChooser]
})
export class ClientesPageModule {}
