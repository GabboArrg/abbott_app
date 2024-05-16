import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { VentaService } from 'src/app/services/venta.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { environment } from 'src/environments/environment';
import { VerFotoComponent } from 'src/app/modals/ver-foto-modal/ver-foto.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-agregar-adjuntos',
  templateUrl: './agregar-adjuntos.component.html',
  styleUrls: ['./agregar-adjuntos.component.scss'],
})
export class AgregarAdjuntosComponent implements OnInit {
  @Input() venta_id: any;
  @Input() is_venta: any;
  @Input() cliente_id: any;
  @Input() cliente_estado: any;
  @Input() archivos: any[] = [];
  previewFiles: any[] = [];
  photos: any[] = [];
  
  constructor(
    private modalController: ModalController,
    private ventaService: VentaService,
    private clienteService: ClienteService,
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
    
  }

  async previewArchivo(archivo: any) {
    if (this.isImage(archivo.content_type)) {
      const archivo_url2= environment.BASE_URL + archivo.adjunto.url
      const modal = await this.modalController.create({
        component: VerFotoComponent,
        componentProps: {
          archivo_url: environment.BASE_URL + archivo.adjunto.url
        }
      });
      return await modal.present();
    } else {
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

  async eliminarArchivo2(archivo_id: any) {// agregar el is_venta
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
              if(this.is_venta) {
                const response = await this.ventaService.deleteArchivo(this.venta_id, archivo_id);
                this.presentAlert('Atención', 'Archivo eliminado exitósamente');
                await this.cargarArchivos(); // Actualizar la lista de archivos
              } else {
                if(this.cliente_estado == "sin_evaluacion") {
                  const response = await this.clienteService.deleteArchivo(this.cliente_id, archivo_id);
                  this.presentAlert('Atención', 'Archivo eliminado exitósamente');
                  await this.cargarArchivos(); // Actualizar la lista de archivos
                } else {
                  this.presentAlert('Atención', 'No se puede eliminar el archivo. El cliente tiene estado: ' + this.cliente_estado);
                }
              }
            } catch (error) {
              console.error("Error: ", error);
              this.presentAlert('Atención', 'Error al actualizar la lista de adjuntos');
            }
          }
        }
      ]
    });
    await confirm.present();
  }
  

  async cargarArchivos() {
    try {
      if (this.is_venta) {
        const venta = await this.ventaService.getVenta(this.venta_id).toPromise();
        this.archivos = venta.venta.archivos;
        this.archivos.forEach((archivo: any, index: number) => {
          archivo.adjunto.url = environment.BASE_URL + archivo.adjunto.url.substring(1);
          archivo.arch_url = archivo.adjunto.url;
          archivo.number = index + 1;
          archivo._destroy = 'false';
        });
      } else {
        // Suscribirse al observable para obtener los datos del cliente
        this.clienteService.getCliente(this.cliente_id).subscribe((cliente: any) => {
          this.archivos = cliente.cliente.archivos;
          // Procesar los archivos
          this.archivos.forEach((archivo: any, index: number) => {
            //archivo.adjunto.url = environment.BASE_URL + archivo.adjunto.url.substring(1);
            archivo.arch_url = archivo.adjunto.url;
            archivo.number = index + 1;
            archivo._destroy = 'false';
          });
        }, (error) => {
          console.error('Error al cargar los archivos: ', error);
        });
      }
    } catch (error) {
      console.error('Error al cargar los archivos: ', error);
    }
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
      const hasPermission = await this.ventaService.requestExternalStoragePermissions();
  
      if (hasPermission) {
        const targetPath = this.file.externalRootDirectory + '/Download/' + nombre;
        const fileTransfer: FileTransferObject = this.transfer.create();
        const download_url = environment.BASE_URL + url;

        fileTransfer.download(download_url, targetPath).then(entry => {
          this.fileOpener.open(entry.toURL(), contentType).then(() => {
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
        console.log('Los permisos de almacenamiento externo fueron denegados');
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
      archivos: this.archivos
    });
  }

  async takePhoto() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      cameraDirection: this.camera.Direction.BACK
    };

    try {
      const imageData = await this.camera.getPicture(options);
      const fileName = `photo_${new Date().getTime()}.jpeg`;
      const fileSize = imageData.length;
      const base64Image = 'data:image/jpeg;base64,' + imageData;

      this.photos.push({ url: base64Image, name: fileName, size: this.returnFileSize(fileSize) });
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

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
      let numFotosCargadas = 0;
  
      const headers = new HttpHeaders({
        'headerName': 'headerValue',
      });
  
      const commonParams = this.is_venta ? { 'venta_id': this.venta_id } : { 'cliente_id': this.cliente_id };
  
      for (const archivo of this.previewFiles) {
        const formData = new FormData();
        formData.append('file', archivo.file, archivo.file.name);
  
        const params = commonParams;
  
        const upload_url = environment.API_ABBOTT + "archivos/";
        await this.uploadFile(upload_url, formData, headers, params);
        numArchivosCargados++;
      }
  
      for (const photo of this.photos) {
        const formData = new FormData();
        const base64Data = photo.url.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        formData.append('file', blob, photo.name);
  
        const params = commonParams;
  
        const upload_url = environment.API_ABBOTT + "archivos/";
        await this.uploadFile(upload_url, formData, headers, params);
        numFotosCargadas++;
      }
  
      this.previewFiles = [];
      this.photos = [];
      const mensajeExito = `Archivos cargados correctamente: ${numArchivosCargados}\nFotos cargadas correctamente: ${numFotosCargadas}`;
      this.presentAlert('Éxito', mensajeExito);
  
      await this.cargarArchivos(); // Recargar los archivos después de subir nuevos
    } catch (error) {
      console.error('Error al subir archivo:', error);
      this.presentAlert('Error', 'Ocurrió un error al subir el archivo.');
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }
  
  async uploadFile(url: string, formData: FormData, headers: HttpHeaders, params: any) {
    try {
      const response = await this.http.post(url, formData, { headers, params }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
  
}
