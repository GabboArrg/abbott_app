import { Component, Input, OnInit, Injectable } from '@angular/core';
import { ModalController, AlertController,LoadingController  } from '@ionic/angular';
import { VentaService } from 'src/app/services/venta.service';
import { environment } from 'src/environments/environment';
import { VerFotoComponent } from 'src/app/modals/ver-foto-modal/ver-foto.component';
import { HttpClient } from '@angular/common/http';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';


@Component({
  selector: 'app-agregar-adjuntos',
  templateUrl: './agregar-adjuntos.component.html',
  styleUrls: ['./agregar-adjuntos.component.scss'],
})
export class AgregarAdjuntosComponent implements OnInit {
  pictureUrl: string | undefined;
  @Input() venta_id: any;
  @Input() archivos: any[] = [];


  constructor(
    private modalController: ModalController,
    private ventaService: VentaService,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private transfer: FileTransfer
  ) { }

  ngOnInit() {
    console.log("archivos: "+this.archivos);
  }

  closeModalVerAdjuntos() {
    this.modalController.dismiss();
  }

  openModalAdjuntos() {
    // Implementa la lógica para abrir el modal de adjuntos si es necesario
  }



  openVerFoto(archUrl: string) {
    // Implementa la lógica para abrir la foto si es necesario
  }

  async previewArchivo(archivo: any) {
    if (this.isImage(archivo.content_type)) {
      const modal = await this.modalController.create({
        component: VerFotoComponent,
        componentProps: {
          archivo_url: environment.BASE_URL + archivo.adjunto.url
        }
      });
      return await modal.present();
    } else {
      // Mostrar una alerta indicando que el archivo no es una imagen
      const alert = await this.alertCtrl.create({
        header: 'Vista previa no disponible',
        message: 'No es posible mostrar una vista previa de este tipo de archivo.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  isImage(contentType: string): boolean {
    return contentType.startsWith('image');
  }

  async eliminarArchivo2(archivo_id: any) {
    const confirm = await this.alertCtrl.create({
      header: 'Eliminar Archivo',
      message: '¿Está seguro de eliminar este Archivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const response = await this.ventaService.deleteArchivo(this.venta_id, archivo_id);
              const venta = await this.ventaService.getVenta(this.venta_id).toPromise(); // Convertir el Observable a promesa
              
              // Verificar si venta.archivos es un arreglo
              if (Array.isArray(venta.archivos)) {
                const archivosActualizados = venta.archivos.map((archivo: any, index: number) => {
                  const archUrl = environment.BASE_URL + archivo.adjunto.url.substring(1);
                  return {
                    ...archivo,
                    arch_url: archUrl,
                    number: index + 1,
                    _destroy: 'false'
                  };
                });

                // Actualizar 'archivos' en la clase
                this.archivos = archivosActualizados;

                // Mostrar alerta
                this.presentAlert('Atención', 'Archivo eliminado exitósamente');
              } else {
                // Mostrar alerta si no se encontraron archivos en la respuesta
                this.presentAlert('Atención', 'No se encontraron archivos en la respuesta');
              }
            } catch (error) {
              // Mostrar alerta de error
              this.presentAlert('Atención', 'Error al actualizar la lista de adjuntos');
            }
          }
        }
      ]
    });
    await confirm.present();
}

  
  truncFilename(nombreArchivo: string): string {
    return nombreArchivo.length > 20 ? nombreArchivo.substr(0, 20) + '...' : nombreArchivo;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  openFilePicker(){}


  async descargarArchivo(url: string, nombre: string, contentType: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Descargando archivo...'
    });
    await loading.present();
  
    try {
      const targetPath = this.file.externalRootDirectory + '/Download/' + nombre;
      const fileTransfer: FileTransferObject = this.transfer.create();
  
      fileTransfer.download(environment.BASE_URL + url.substring(1), targetPath).then(entry => {
        console.log('Archivo descargado en: ' + entry.toURL());
        this.fileOpener.open(entry.toURL(), contentType).then(() => {
          console.log('Archivo abierto correctamente');
        }).catch(error => {
          console.error('Error al abrir archivo:', error);
        });
      }).catch(error => {
        console.error('Error al descargar archivo:', error);
      });
    } catch (error) {
      console.error('Error al descargar y abrir archivo:', error);
    } finally {
      await loading.dismiss();
    }
  }
  


}
