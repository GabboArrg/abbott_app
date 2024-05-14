import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController  } from '@ionic/angular';
import { VentaService } from 'src/app/services/venta.service';
import { environment } from 'src/environments/environment';
import { VerFotoComponent } from 'src/app/modals/ver-foto-modal/ver-foto.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';

@Component({
  selector: 'app-agregar-adjuntos',
  templateUrl: './agregar-adjuntos.component.html',
  styleUrls: ['./agregar-adjuntos.component.scss'],
})
export class AgregarAdjuntosComponent implements OnInit {
  @Input() venta_id: any;
  @Input() archivos: any[] = [];
  archivoSeleccionado: any;
  previewFiles: any[] = [];

  constructor(
    private modalController: ModalController,
    private ventaService: VentaService,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private file: File,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private filePath: FilePath,
    private fileChooser: FileChooser
  ) { }

  ngOnInit() {
    console.log("archivos: " + this.archivos);
  }

  closeModalVerAdjuntos() {
    this.modalController.dismiss();
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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async descargarArchivo(url: string, nombre: string, contentType: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Descargando archivo...',
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'spinner-energized'
    });
    await loading.present();
  
    try {
      // Solicitar permisos de almacenamiento externo antes de descargar el archivo
      const hasPermission = await this.ventaService.requestExternalStoragePermissions();
  
      if (hasPermission) {
        // Continuar con la lógica de descarga de archivos aquí
        const targetPath = this.file.externalRootDirectory + '/Download/' + nombre;
        const fileTransfer: FileTransferObject = this.transfer.create();
        const download_url = environment.BASE_URL + url;
  
        console.log("url: " + url);
        console.log("url corregida: " + download_url);
        console.log("targetPath: " + targetPath);
        fileTransfer.download(download_url, targetPath).then(entry => {
          console.log('Archivo descargado en: ' + entry.toURL());
          this.fileOpener.open(entry.toURL(), contentType).then(() => {
            console.log('Archivo abierto correctamente');
            loading.dismiss(); // Cerrar el mensaje de carga después de abrir el archivo
          }).catch(error => {
            console.error('Error al abrir archivo:', error);
            loading.dismiss(); // Cerrar el mensaje de carga si hay un error al abrir el archivo
          });
        }).catch(error => {
          console.error('Error al descargar archivo:', error);
          loading.dismiss(); // Cerrar el mensaje de carga si hay un error al descargar el archivo
        });
      } else {
        // Manejar el caso en el que los permisos sean denegados
        console.log('Los permisos de almacenamiento externo fueron denegados');
        // Muestra un mensaje de error al usuario o toma alguna otra acción apropiada
        loading.dismiss(); // Cerrar el mensaje de carga si los permisos fueron denegados
      }
    } catch (error) {
      console.error('Error al descargar y abrir archivo:', error);
      loading.dismiss(); // Cerrar el mensaje de carga si hay un error general
    }
  }
  

  async submitForm() {
    if (!this.previewFiles.length) {
        this.presentAlert('Error', 'No se ha seleccionado ningún archivo.');
        return;
    }
  
    const loading = await this.loadingCtrl.create({
        message: 'Subiendo archivo...',
        spinner: 'bubbles',
        translucent: true,
        cssClass: 'spinner-energized'
    });
    await loading.present();
  
    try {
        for (const archivo of this.previewFiles) {
            const formData = new FormData();
            formData.append('file', archivo.file, archivo.file.name);

            // Configurar encabezados
            const headers = new HttpHeaders({
                'headerName': 'headerValue', // Ajusta los encabezados según sea necesario
                // Agrega más encabezados si es necesario
            });

            // Configurar parámetros
            const params = {
                'venta_id': this.venta_id,
                // Ajusta los parámetros según sea necesario
            };

            const upload_url = environment.API_ABBOTT + "archivos/";
            
            // Realizar la solicitud POST con encabezados y parámetros  + archivo.file.name
            const response = await this.http.post(upload_url, formData, { headers, params }).toPromise();
        }

        // Limpiar la vista previa y cerrar el modal después de una carga exitosa
        this.previewFiles = [];
        await this.loadingCtrl.dismiss();
        await this.modalController.dismiss(); // Cerrar el modal después de cargar exitosamente
        this.presentAlert('Éxito', 'Archivo(s) subido(s) exitosamente.');
    } catch (error) {
        console.error('Error al subir archivo:', error);
        this.presentAlert('Error', 'Ocurrió un error al subir el archivo.');
    } finally {
        await loading.dismiss();
    }
  }

  async onFileChange(event: any) {
    const files = event.target.files;
    this.previewFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.previewFiles.push({ file: file, url: e.target.result });
      };

      reader.readAsDataURL(file);
    }
  }

  returnFileSize(size: number): string {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size >= 1024 && size < 1048576) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size >= 1048576) {
      return `${(size / 1048576).toFixed(1)} MB`;
    } else {
      return '';
    }
  }

}
function archivo(value: any, index: number, array: any[]): void {
  throw new Error('Function not implemented.');
}

