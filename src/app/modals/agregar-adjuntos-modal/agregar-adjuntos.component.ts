import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { VentaService } from 'src/app/services/venta.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.ventaService.getArchivos().subscribe((archivos: any[]) => {
      this.archivos = archivos;
    });
  }

  closeModalVerAdjuntos() {
    this.modalController.dismiss();
  }

  openModalAdjuntos() {
    // Implementa la lógica para abrir el modal de adjuntos si es necesario
  }

  isImage(contentType: string): boolean {
    return contentType.startsWith('image');
  }

  openVerFoto(archUrl: string) {
    // Implementa la lógica para abrir la foto si es necesario
  }

  descargarArchivo(archUrl: string, nombreArchivo: string, contentType: string) {
    // Implementa la lógica para descargar el archivo si es necesario
  }


  async eliminarArchivo2(venta_id: any, archivo_id: any) {
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
              const response = await this.ventaService.deleteArchivo(venta_id, archivo_id);
              const venta = await this.ventaService.getVenta(venta_id).toPromise(); // Convertir el Observable a promesa
              
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
}
