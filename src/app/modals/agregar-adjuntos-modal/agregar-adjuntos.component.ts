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
import { Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

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
  photos: any[] = [];

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
    private fileChooser: FileChooser,
    private camera: Camera
  ) { }

  ngOnInit() {
    console.log("archivos: " + this.archivos);
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
              const response = this.ventaService.deleteArchivo(this.venta_id, archivo_id);
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

  closeModalAdjuntos() {
    // Devolvemos los datos actualizados al cerrar el modal
    this.modalController.dismiss({

    });
  }

// En el método takePhoto()
  async takePhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    try {
      const imageData = await this.camera.getPicture(options);
      const fileName = `photo_${new Date().getTime()}.jpeg`;
      const fileSize = imageData.length;
      const base64Image = 'data:image/jpeg;base64,' + imageData;

      // Almacenar la foto temporalmente
      this.photos.push({ url: base64Image, name: fileName, size: this.returnFileSize(fileSize) });
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  // En el método submitForm()
  async submitForm() {
    if (!this.previewFiles.length && !this.photos.length) {
        this.presentAlert('Error', 'No se ha seleccionado ningún archivo ni foto.');
        return;
    }

    const loading = await this.loadingCtrl.create({
        message: 'Subiendo archivo...',
        spinner: 'bubbles',
        translucent: true,
        cssClass: 'spinner-energized'
    });
    
    try {
        await loading.present();

        let numArchivosCargados = 0;
        for (const archivo of this.previewFiles) {
            const formData = new FormData();
            formData.append('file', archivo.file, archivo.file.name);

            const headers = new HttpHeaders({
                'headerName': 'headerValue',
            });

            // Configurar parámetros
            const params = {
                'venta_id': this.venta_id,
            };
            const upload_url = environment.API_ABBOTT + "archivos/";
            const response = await this.http.post(upload_url, formData, { headers, params }).toPromise();
            numArchivosCargados++;
        }
        

        let numFotosCargadas = 0;
        for (const photo of this.photos) {
          const formData = new FormData();
          // Esto no está correcto
          // formData.append('file', photo.url, photo.name);
      
          // Debes crear un Blob a partir de la URL de la foto
          const base64Data = photo.url.split(',')[1]; // Obtener solo los datos base64
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
          // Ahora puedes pasar el Blob como segundo parámetro
          formData.append('file', blob, photo.name);
      
          const headers = new HttpHeaders({
              'headerName': 'headerValue',
          });
          const params = {
              'venta_id': this.venta_id,
          };
          // Enviar la foto al servidor
          const upload_url = environment.API_ABBOTT + "archivos/";
          const response = await this.http.post(upload_url, formData, { headers, params }).toPromise();
          numFotosCargadas++;
          console.log('Foto enviada al servidor:', response);
      }
      

        // Limpiar la vista previa y cerrar el modal después de una carga exitosa
        this.previewFiles = [];
        this.photos = [];
        const mensajeExito = `Archivos cargados correctamente: ${numArchivosCargados}\nFotos cargadas correctamente: ${numFotosCargadas}`;
        this.presentAlert('Éxito', mensajeExito);

    } catch (error) {
        console.error('Error al subir archivo:', error);
        this.presentAlert('Error', 'Ocurrió un error al subir el archivo.');
    } finally {
        if (loading) {
            await loading.dismiss();
        }
    }
  }

}