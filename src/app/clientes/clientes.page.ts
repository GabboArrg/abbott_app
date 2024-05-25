import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
import { UserService } from 'src/app/login/services/user.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { FileChooser } from '@awesome-cordova-plugins/file-chooser/ngx';
import { Observable, map } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AgregarDireccionComponent } from 'src/app/modals/agregar-direccion-modal/agregar-direccion.component';
import { AgregarContactoComponent } from 'src/app/modals/agregar-contacto-modal/agregar-contacto.component';
import { AgregarAdjuntosComponent } from 'src/app/modals/agregar-adjuntos-modal/agregar-adjuntos.component';


interface ClienteContacto {
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  _destroy: string;
}
interface Cliente {
  cliente_clase_id: string;
  rut: string;
  nombre: string;
  email: string;
  web: string;
  idioma_id: string;
  moneda_id: string;
  giro: string;
  observacion: string;
  direccion: string;
  pais_id: string;
  region_id: string;
  cliente_contactos_attributes: ClienteContacto[];
  [key: string]: any;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit{
  paises: any = {};
  monedas: any = {};
  regiones: any = [];
  comunas: any = [];
  comunasCliente: any[] = [];
  clientes: any = {};
  cliente: any = {};
  clienteObservable: Observable<any> | null = null;
  responseCliente: any = {};
  idCliente: any = {};
  titulo: string = '';
  contacto: any = {};
  contactos: any[] = [];
  sucursal: any = {};
  sucursales: any[] = [];
  selectedData: any = {};
  statusCliente: string = '';
  archivos: any[] = [];
  pictureUrl: string = 'img/sin_imagen.png';
  dataUrl: string = '';
  curr_url: string = 'img/sin_imagen.png';
  ready_url: string = 'img/loading.gif';
  clienteId: number = 0;
  archivoId: number = 0;
  cargado: boolean = false;
  start: any = '';
  archivos_elegidos: any[] = [];
  tituloVarLocal: string | undefined;
  editarCliente: boolean  = false;
  cliente_contactos: any = [];
  loadingController: any;
  alertController: any;
  

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public clienteService: ClienteService,
    public ventaService: VentaService,
    public userService: UserService,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public transfer: FileTransfer,
    public fileOpener: FileOpener,
    public filePath: FilePath,
    public fileChooser: FileChooser,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController
  ) {
    this.comunas = [];
    this.comunasCliente = [];
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idCliente = params.get('idCliente');
    });
    if (this.idCliente !== null){
      this.tituloVarLocal = 'Editar Cliente';
      this.editarCliente = true;
    }else{
      this.tituloVarLocal = 'Crear Cliente';
      this.editarCliente = false;
    }
  }





///      COMIENZA AGREGAR CLIENTES      ///

agregarCliente(): void {
  if (this.contactos.length === 0) {
    this.mostrarAlerta('Error', 'Debe ingresar al menos un contacto');
    return;
  }

  const userId = this.userService.getId();
  if (!userId) {
    this.mostrarAlerta('Error', 'ID de usuario no encontrado');
    return;
  }

  const tmpCliente = {
    cliente: {
      id: this.cliente.id || null,
      cliente_clase_id: '1',
      rut: this.getMember(this.cliente.rut),
      nombre: this.getMember(this.cliente.nombre),
      email: this.getMember(this.cliente.email),
      web: this.getMember(this.cliente.web),
      idioma_id: '40',
      moneda_id: '29',
      giro: this.getMember(this.cliente.giro),
      observacion: this.getMember(this.cliente.observacion),
      direccion: this.getMember(this.cliente.direccion),
      pais_id: '41',
      region_id: this.getMember(this.selectedData.region),
      comuna_id: this.getMember(this.selectedData.comuna),
      ciudad: this.getMember(this.cliente.ciudad),
      codigopostal: this.getMember(this.cliente.codigopostal),
      telefono: this.getMember(this.cliente.telefono),
      tmobil: this.getMember(this.cliente.tmobil),
      visitador_user_id: userId,
      medico_responsable: this.getMember(this.cliente.medico_responsable),
      especialidad: this.getMember(this.cliente.especialidad),
      estado: this.getMember(this.cliente.estado),
      cliente_contactos_attributes: this.contactos
        .filter(contacto => !(contacto._destroy === 'true' && contacto.id === undefined))
        .map(contacto => {
          const { is_new, ...contactoSinIsNew } = contacto;
          return {
            ...contactoSinIsNew,
            _destroy: contacto._destroy || 'false'
          };
        })
    }
  };

  const catch_response = (response: any) => {
    console.log("Response received:", response);
    if (response && response.cliente) {
      this.cliente.id = response.cliente.id;
    }

    this.sucursales.forEach((sucursal: any) => {
      const tmp = {
        cliente_sucursal: {
          cliente_id: this.getMember(this.cliente.id),
          nombre: this.getMember(sucursal.nombre),
          recibe: this.getMember(sucursal.recibe),
          pais_id: '41',
          ciudad: this.getMember(sucursal.ciudad),
          region_id: this.getMember(sucursal.selectedData.region.id),
          comuna_id: this.getMember(sucursal.selectedData.comuna.id),
          direccion: this.getMember(sucursal.direccion),
          telefono: this.getMember(sucursal.telefono),
          movil: this.getMember(sucursal.movil),
          email: this.getMember(sucursal.email),
          codpostal: this.getMember(sucursal.codpostal),
          req_adicionales: this.getMember(sucursal.req_adicionales),
          pais: this.getMember(sucursal.pais),
          region: this.getMember(sucursal.region),
          comuna: this.getMember(sucursal.comuna)
        }
      };

      if (sucursal._destroy === 'false') {
        if (sucursal.is_new === 'true') {
          console.log("POSTSUCURSAL: " + JSON.stringify(tmp));
          this.clienteService.postSucursal(tmp).subscribe(() => {
            console.log("Sucursal añadida exitosamente");
          }, () => {
            console.log("Error al añadir la sucursal");
          });
        } else {
          if (!sucursal.casa_matriz) {
            console.log("PATCH SUCURSAL: " + JSON.stringify(tmp));
            this.clienteService.patchSucursal(tmp, this.getMember(sucursal.id)).subscribe(() => {
              console.log("Sucursal actualizada exitosamente");
            }, () => {
              console.log("Error al actualizar la sucursal");
            });
          }
        }
      } else {
        console.log("DELETE SUCURSAL ID: " + this.getMember(sucursal.id));
        this.clienteService.deleteSucursal(this.getMember(sucursal.id)).subscribe(() => {
          console.log("Sucursal eliminada");
        }, () => {
          console.log("Error al eliminar la sucursal");
          const msg = 'La sucursal ' + sucursal.nombre + ' no se puede eliminar';
          this.mostrarAlerta('Atención', msg);
        });
      }
    });

    let msg = '';
    if (this.editarCliente === true) {
      msg = 'El cliente ha sido añadido exitosamente';
    } else {
      msg = 'El cliente ha sido actualizado exitosamente';
    }
    this.mostrarAlerta('Atención', msg);
    this.router.navigate(['/home']);
  };

  const catch_error = (error: any) => {
    console.log("Error response:", error);
    let msg = '<br>';
    for (const k in error.data) {
      let j = k;
      j = j.replace(/\w/, c => c.toUpperCase());
      j = j.replace("_", " ");
      msg += '<b>' + j + '</b><br>' + error.data[k] + '<br>';
    }
    this.mostrarAlerta('Error', 'Uno o más campos se encuentran vacíos o con error' + msg);
  };

  this.loadingCtrl.create({
    message: 'Cargando...',
    spinner: 'bubbles',
    translucent: true
  }).then((loading) => {
    loading.present();
    if (this.editarCliente === false) {
      console.log("POST Cliente: " + JSON.stringify(tmpCliente));
      this.clienteService.postCliente(tmpCliente).subscribe(
        (response: any) => {
          catch_response(response);
          loading.dismiss();
        },
        (error: any) => {
          catch_error(error);
          loading.dismiss();
        }
      );
    } else {
      console.log("PATCH Cliente: " + JSON.stringify(tmpCliente));
      this.clienteService.patchCliente(tmpCliente, tmpCliente.cliente.id).subscribe(
        (response: any) => {
          catch_response(response);
          loading.dismiss();
        },
        (error: any) => {
          catch_error(error);
          loading.dismiss();
        }
      );
    }
  });
}





  ///      FINALIZA AGREGAR CLIENTES      ///

  mostrarAlerta(titulo: string, mensaje: string) {
    this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  
  
  getMember(member: any): string {
    return member !== null && member !== '' && member !== undefined && member.length !== 0 ? (typeof member !== 'string' ? member.toString() : member) : '';
  }
  

  eliminarSucursal(sucursal: any) {
    sucursal['_destroy'] = 'true';
  }
  
  eliminarContacto(contacto: any) {
    contacto['_destroy'] = 'true';
  }
  

  solicitarEvaluacion(){

  }

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...'
    });
    await loading.present();
    try {
      const userId = this.userService.getId();
      const comunas$ = this.clienteService.getComunas();
      const regiones$ = this.clienteService.getRegiones();
      const paises$ = this.clienteService.getPaises();
      const monedas$ = this.clienteService.getMonedas();
      let cliente$: Observable<any> | null = null;
      if (userId !== null) {
        cliente$ = this.clienteService.getCliente(this.idCliente);
        if (cliente$ == null){
          cliente$ =null;
        }
      }
  
      // Esperar a que todas las llamadas asíncronas se completen
      const [comunasResponse, regionesResponse, paises, monedas, cliente] = await Promise.all([
        comunas$.toPromise(),
        regiones$.toPromise(),
        paises$.toPromise(),
        monedas$.toPromise(),
        cliente$ ? cliente$.toPromise() : null
      ]);
  
      // Manejar los datos recibidos
  
      this.comunas = comunasResponse.monedas.map((comuna: any) => ({
        id: comuna.id,
        nombre: comuna.nombre,
        region: comuna.region
      }));
  
      const regiones = regionesResponse.monedas.map((region: any) => ({
        id: region.id,
        nombre: region.nombre,
        numero: region.numero
      }));
      this.regiones = regiones;
  
      this.paises = paises;
  
      this.monedas = monedas;
  
      if (this.idCliente !== null && userId !== null && cliente !== null) {
        this.cliente = cliente.cliente;
        this.selectedData.region = this.cliente.region.id;
        this.selectedData.moneda = this.cliente.moneda.id;
        this.selectedData.pais = this.cliente.pais.id;
        this.cliente.region_id = this.cliente.region.id;
        this.cliente.comuna_id = this.cliente.comuna.id;
        this.cliente.moneda_id = this.cliente.moneda.id;
        this.cliente.pais_id = this.cliente.pais.id;
        if (this.cliente.comuna.id && this.cliente.region.id) {
          this.actualizarComunas();
          this.selectedData.comuna = this.cliente.comuna.id;
        }
        if (this.cliente.cliente_contactos !== undefined) {
          this.cliente.cliente_contactos.forEach((contacto: any) => {
            var tmp = contacto;
            tmp.id = tmp.id.toString();
            tmp['_destroy'] = 'false';
            this.contactos.push(tmp);
          });
        }
        if (this.cliente.cliente_sucursales !== undefined) {
          this.cliente.cliente_sucursales.forEach((sucursal: any) => {
            var tmp = sucursal;
            tmp.is_new = 'false';
            tmp._destroy = 'false';
            tmp.selectedData = {};
            tmp.selectedData.region = {
              id: +tmp.region_id,
              nombre: tmp.region,
              numero: tmp.numero
            };
            tmp.selectedData.comuna = {
              id: +tmp.comuna_id,
              nombre: tmp.comuna
            };
            this.sucursales.push(tmp);
          });
        }
  

        if (this.cliente.archivos !== undefined ) {
          this.archivos = this.cliente.archivos;
          let cont = 1;
          //console.log("cliente: "+ JSON.stringify(this.cliente));
          this.archivos.forEach((archivo: any) => {
            //archivo.adjunto.url = environment.BASE_URL + archivo.adjunto.url.substring(1, archivo.adjunto.url.length);
            archivo.arch_url = archivo.adjunto.url;
            archivo.number = cont;
            archivo._destroy = 'false';
            cont++;
          });
        }



      }
  
      // Ahora que todas las operaciones asíncronas han terminado, llamamos a actualizarComunas()
      this.actualizarComunas();
    } catch (error) {
      console.error(error);
    } finally {
      await loading.dismiss();
    }
  }
  
  regionesResponse(regionesResponse: any) {
    throw new Error('Method not implemented.');
  }
  

  actualizarComunas() {
    const comunasCliente = () => {
      this.comunasCliente = [];
      this.comunas.forEach((comuna: any) => {
        if (comuna.region === this.selectedData.region) {
          this.comunasCliente.push(comuna);
        }
      });
    };
  
    const comunasSucursales = () => {
      this.sucursales.forEach((sucursal: any) => {
        sucursal.comunas = [];
        this.comunas.forEach((comuna: any) => {
          if (comuna.region === sucursal.selectedData.region.id) {
            sucursal.comunas.push(comuna);
          }
        });
      });
    };
  
    const comunasSucursalesAdd = () => {
      this.sucursal.comunas = [];
      if (this.sucursal.selectedData) {
        this.comunas.forEach((comuna: any) => {
          if (comuna.region === this.sucursal.selectedData.region.id) {
            this.sucursal.comunas.push(comuna);
          }
        });
      }
    };
  
    comunasCliente();
    if (this.sucursales.length !== 0) {
      comunasSucursales();
    }
    if (this.sucursal) {
      if (this.sucursal.comunas) {
        comunasSucursalesAdd();
      }
    }
  }







  takePicture() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800
    };
    this.camera.getPicture(options).then((data) => {
      this.pictureUrl = data;
    }, (error) => {
      console.error(error);
    });
  }

  fromGallery() {
    const options = {
      maximumImagesCount: 1,
      quality: 50
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        this.pictureUrl = results[i];
      }
    }, (error) => {
      console.error(error);
    });
  }

  fromFileExplorer() {
    this.fileChooser.open().then((uri) => {
      this.filePath.resolveNativePath(uri).then((path) => {
        // Lógica para manejar la ruta del archivo
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  descartar_archivo(path: string) {
    const index = this.archivos_elegidos.findIndex(x => x.path === path);
    if (index >= 0) {
      this.archivos_elegidos.splice(index, 1);
    }
  }

  subirAdjunto() {
    this.loadingCtrl.create({ message: 'Cargando...' }).then((loading) => {
      loading.present();
      let exito = true;
      this.archivos_elegidos.forEach((archivo) => {
        const options: FileUploadOptions = {
          fileKey: 'file',
          fileName: archivo.nombre,
          chunkedMode: false,
          params: { cliente_id: this.idCliente, archivo: '' }
        };
        (this.transfer as any).upload(environment.API_ABBOTT + 'archivos/', archivo.path, options).then((result: any) => {
          this.clienteService.getFiles(this.idCliente).subscribe((data: any[]) => {
            this.archivos = data;
            loading.dismiss();
          }, (error: any) => {
            console.error(error);
            loading.dismiss();
          });
        }, (error: any) => {
          exito = false;
          console.error(error);
          loading.dismiss();
        });
      });
      if (exito) {
        this.archivos_elegidos = [];
      }
    });
  }

  //modals

  async abrirModalAgregarDireccion() {
    const modal = await this.modalController.create({
      component: AgregarDireccionComponent,
      componentProps: {
        comunas: this.comunas,
        regiones: this.regiones
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        // Aquí obtenemos los datos del modal cerrado y actualizamos las variables necesarias
        const { sucursal } = data.data;
        this.sucursales.push(sucursal);
        console.log("ondidmiss modal agregar direccion: "+ JSON.stringify(this.sucursales));
      }
    });
    return await modal.present();
  }

  async abrirModalAgregarContacto() {
    const modal = await this.modalController.create({
      component: AgregarContactoComponent,
      componentProps: {
        comunas: this.comunas,
        regiones: this.regiones,
        sucursal: this.sucursal
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        // Aquí obtenemos los datos del modal cerrado y actualizamos las variables necesarias
        const { contacto } = data.data;
        this.contactos.push(contacto);

      }
    });
    return await modal.present();
  }

  async openModalVerAdjuntos(ventaId: any) {
    const modal = await this.modalController.create({
      component: AgregarAdjuntosComponent,
      componentProps: {
        venta_id: ventaId,
        archivos: this.archivos,
        is_venta: false,
        cliente_id: this.idCliente,
        cliente_estado: this.cliente.estado
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.archivos) {
        this.archivos = data.data.archivos;
      }
    });

    await modal.present();
  }

}
