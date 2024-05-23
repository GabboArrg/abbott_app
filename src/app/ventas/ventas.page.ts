import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, PopoverController, ToastController, AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { VentaService } from 'src/app/services/venta.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AgregarProductosComponent } from 'src/app/modals/agregar-productos-modal/agregar-productos.component';
import { AgregarAdjuntosComponent } from 'src/app/modals/agregar-adjuntos-modal/agregar-adjuntos.component';
import { DespachoComponent } from 'src/app/modals/despacho-modal/despacho-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {

  verpedidos: boolean = false;
  creaVenta: boolean = true;

  material: any = {};
  idProducto: string = "";
  cantidad: number = 0;
  es_muestra: boolean = false;
  promo_aplicada: boolean = false;
  promo_asociada: any = null;
  cod_pos: any = null;
  tiene_bonificacion: boolean = false;
  promociones: any = {};
  codigo_producto: string = "";
  pos_venta_attributes: any[] = [];
  booleanBonificacion: boolean = true;
  onlyNumbers: RegExp = /^\d+$/;
  socSucursales: any[] = [];
  idSucursal: number = 0;
  idFormaPago: number = 0;
  socSucursal: any[] = [];
  formaPago: any = {};
  generico_precio: number = 0;
  ventaAux: any = {};
  cliente: any = {};
  formaPagos: any[] = [];
  archivos_elegidos: any[] = [];
  archivos: any[] = [];
  formaPagoDefecto: number = 0;
  tituloVarLocal: string | undefined;
  ver_adjuntos: any;
  codprod: string | undefined;
  descuento: string | undefined;
  nprecio: number | undefined;
  subtotal_pos: number | undefined;
  total_pos: number | undefined;
  niva: number | undefined;
  materiales: any = [];
  promopacks: any = [];
  venta: any = {};
  idVenta: number = 0;
  idCliente: number = 0;
  selsucursal: any;
  selformapago: number | undefined;
  editarCliente: boolean  = true;
  nprecio1: any;
  bonificacion: number | undefined;
  nneto: number | undefined;
  nbruto: number | undefined;
  fechaFormateada: string | undefined;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private fileTransfer: FileTransfer,
    private fileOpener: FileOpener,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit() {
    
    this.tituloVarLocal = 'Detalle Pedido';
    this.activatedRoute.params.subscribe(params => {
      this.idCliente = +params['idCliente'];
      this.idVenta = +params['idVenta'];
      if (!this.idVenta) {
        this.creaVenta = true;
        const today = new Date().toLocaleDateString();
        this.venta = {
          'doc_venta_clase_id': '1',
          'sociedad_id': '1',
          'fecha': today,
          'sociedad_sucursal_id': '1',
          'type': 'PedidoVenta',
          'user_id': this.userService.getId(),
          'pais_id': '65',
          'cliente_id': this.idCliente,
          'moneda_id': '29',
          'despacho_clase_id': '1',
          'observaciones': '',
          'cliente': {
            'nombre': '',
            'estado': '',
            'email': ''
          }
        }
        this.clienteService.getCliente(this.idCliente.toString()).subscribe((data: any) => {
          this.venta.cliente.email = data.cliente.email;
          this.venta.cliente.estado = data.cliente.estado;
          this.venta.cliente.nombre = data.cliente.nombre;
      
        });
        
        
        this.ventaService.getFormaPago(this.idCliente).subscribe((resp: any) => {
          // Asignar los datos a las variables correspondientes
          this.formaPagos = Object.values(resp.forma_pago);
          this.formaPagoDefecto = resp.forma_pago_defecto;
          this.selformapago = this.formaPagoDefecto;
          this.idFormaPago = this.selformapago;
        }, (error: any) => {
          console.log("Error en getFormaPago = " + error);
        });
        
      } else {
        this.creaVenta = false;
        this.ventaService.getVenta(this.idVenta).subscribe((venta: any) => {
          this.venta = venta.venta;

          const fechaVenta = new Date(this.venta.fecha);
          this.fechaFormateada = fechaVenta.toLocaleDateString();
          this.venta.observaciones = venta.venta.observacion;
          this.idSucursal = this.venta.sucursal_facturacion.id;
          this.idFormaPago = this.venta.forma_pago.id;
          this.socSucursal = this.venta.sucursal_facturacion;
          this.selsucursal = this.idSucursal;
          this.formaPago = this.venta.forma_pago;
          this.selformapago = this.formaPago.id;
          this.idCliente = this.venta.cliente.id;
          

          this.ventaService.getFormaPago(this.idCliente).subscribe((resp: any) => {
            // Asignar los datos a las variables correspondientes
            this.formaPagos = Object.values(resp.forma_pago);
          }, (error: any) => {
            console.log("Error en getFormaPago = " + error);
          });
          
          this.archivos = [];
          this.archivos = Object.values(this.venta.archivos)

          if (venta.archivos !== undefined ) {
            this.archivos = venta.archivos;
            let cont = 1;
            this.archivos.forEach((archivo: any) => {
              archivo.adjunto.url = environment.BASE_URL + archivo.adjunto.url.substring(1, archivo.adjunto.url.length);
              archivo.arch_url = archivo.adjunto.url;
              archivo.number = cont;
              archivo._destroy = 'false';
              cont++;
            });
          }
        }, (error: any) => {
          console.log(error);
        });
      }
    });
  }

  setEstadoPedido(estado: string): boolean {
    return estado == 'confirmado' ? true : false;
  }

  setEstadoPedido2(estado: string): boolean {
    return estado != 'confirmado' ? true : false;
  }

  async ionViewWillEnter() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'spinner-energized'
    });
    await loading.present();

    this.ventaService.getMateriales().subscribe(
      materiales => {
        this.materiales = materiales.materiales
        loading.dismiss();
      },
      error => {
        console.log(error);
        loading.dismiss();
      }
    );
    

    this.ventaService.getSocSucursal().subscribe(
      resp => {
        this.socSucursales = resp.sociedad_sucursal;
        loading.dismiss();
      },
      error => {
        console.log("Error en getSociSucursal = " + error);
        loading.dismiss();
      }
    );

    this.ventaService.getPromopacks().subscribe(
      promopacks => {
        this.promopacks = promopacks.promopacks;
        loading.dismiss();
      },
      error => {
        console.log("Error en getPromopacks:", error.message); // Imprime el mensaje de error específico
        console.log("Error detallado:", error); // Imprime el objeto de error completo para obtener más detalles
        loading.dismiss();
      }
    );

  }


  async borraProducto(itemId: string, venta_id: string): Promise<void> {
    if (this.venta.entregas !== "Sin entregas realizadas.") {
      const alertPopup = await this.alertCtrl.create({
        header: 'Error',
        message: "El pedido posee entregas.",
        buttons: ['OK']
      });
      await alertPopup.present();
      return;
    }
  
    const confirmPopup = await this.alertCtrl.create({
      header: 'Eliminar Producto',
      message: '¿Está seguro de eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.pos_venta_attributes = [];
            this.updateProductos();
  
            for (let i = 0; i < this.venta.productos.length; i++) {
              let destruir = false;
              if (this.venta.productos[i].id === itemId) {
                destruir = true;
              }
  
              const materialProd = this.ventaService.getMaterialByCodigo(this.materiales, this.venta.productos[i].material.codigo);
  
              // Eliminar promo asociada
              if (this.venta.productos[i].id === itemId) {
                for (let w = 0; w < this.venta.productos.length; w++) {
                  if (this.venta.productos[i].promo_asociada === this.venta.productos[w].promo_asociada) {
                    this.venta.productos[w].promo_aplicada = false;
                    this.venta.productos[w].promo_asociada = null;
                    this.venta.productos[w].descuento = 0;
                    this.venta.productos[w].total_pos = this.venta.productos[w].precio * this.venta.productos[w].cantidad;
  
                    this.venta.productos[i].promo_aplicada = false;
                    this.venta.productos[i].promo_asociada = null;
                    this.venta.productos[i].descuento = 0;
                    this.venta.productos[i].total_pos = this.venta.productos[i].precio * this.venta.productos[i].cantidad;
                  }
                }
              }
  
              if (this.venta.productos[i].promo_aplicada) {
                this.venta.productos[i].promo_aplicada = false;
                this.venta.productos[i].promo_asociada = null;
                this.venta.productos[i].descuento = 0;
                this.venta.productos[i].total_pos = this.venta.productos[i].precio * this.venta.productos[i].cantidad;
              }
  
              const nuevoProd = {
                id: this.venta.productos[i].id,
                pos_venta_clase_id: '2',
                material_id: materialProd.id,
                descripcion: materialProd.descripcion,
                medida_id: materialProd.medida.id,
                precio: this.venta.productos[i].precio,
                cantidad: this.venta.productos[i].cantidad,
                bonificacion: this.venta.productos[i].bonificacion,
                material_tipo_id: materialProd.material_tipo_id,
                es_muestra: this.venta.productos[i].es_muestra,
                promo_aplicada: this.venta.productos[i].promo_aplicada,
                promo_asociada: this.venta.productos[i].promo_asociada,
                cod_pos: this.venta.productos[i].cod_pos,
                descuento: this.venta.productos[i].descuento,
                _destroy: destruir
              };
  
              this.pos_venta_attributes.push(nuevoProd);
            }
  
            this.findAndRemove(this.venta.productos, 'id', itemId);
            this.aplicarPromopacks();
  
            const today = new Date().toISOString().slice(0, 10);
  
            if (this.idSucursal === 0) {
              const alertPopup = await this.alertCtrl.create({
                header: 'Error',
                message: "Debe seleccionar sucursal facturación",
                buttons: ['OK']
              });
              await alertPopup.present();
              return;
            }
  
            if (this.idFormaPago === 0) {
              const alertPopup = await this.alertCtrl.create({
                header: 'Error',
                message: "Debe seleccionar Forma de Pago",
                buttons: ['OK']
              });
              await alertPopup.present();
              return;
            }
  
            const idUsr = this.userService.getId();
  
            const data = {
              pedido_venta: {
                doc_venta_clase_id: '1',
                sociedad_id: '1',
                sociedad_sucursal_id: this.idSucursal,
                forma_pago_id: this.idFormaPago,
                type: 'PedidoVenta',
                user_id: idUsr,
                pais_id: '65',
                cliente_id: this.venta.cliente.id,
                moneda_id: '29',
                despacho_clase_id: '1',
                observaciones: this.venta.observaciones,
                pos_ventas_attributes: this.pos_venta_attributes
              }
            };
  
            if (this.venta.id) {
              this.ventaService.updateVenta(data, this.venta.id).then(resp => {
              }).catch(async error => {
                const alertPopup = await this.alertCtrl.create({
                  header: 'Error',
                  message: error,
                  buttons: ['OK']
                });
                await alertPopup.present();
              });
            }
          }
        }
      ]
    });
  
    await confirmPopup.present();
  }
  
  async aplicarPromopacks() {
    await this.ventaService.aplicarPromopacks(this.venta,this.promopacks);
  }

  findAndRemove(array: any[], property: string, value: any): void {
    const index = array.findIndex(result => result[property] === value);
    if (index !== -1) {
      array.splice(index, 1);
    }
    this.updateProductos();
  }
  

  async verProductos(idVenta: number) {
    this.navCtrl.navigateForward('/productos-venta/' + idVenta);
  }

  async eliminarVenta() {
    const confirmPopup = await this.alertCtrl.create({
      header: 'Eliminar Pedido',
      message: '¿Está seguro de eliminar este Pedido?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.ventaService.borraVenta(this.idVenta);
              const alert = await this.alertCtrl.create({
                header: 'Pedido Eliminado',
                message: 'Pedido eliminado correctamente',
                buttons: ['OK']
              });
              await alert.present();
              this.navCtrl.navigateRoot('/abbott');
            } catch (error: any) { // Especificamos 'any' como tipo de error
              const alert = await this.alertCtrl.create({
                header: 'Error al eliminar pedido',
                message: error.data,
                buttons: ['OK']
              });
              await alert.present();
            }
          }
        }
      ]
    });

    await confirmPopup.present();
  }


  async getReSendEmail() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'spinner-energized'
    });
    await loading.present();

    this.ventaService.getReSendEmail(this.venta.id)
      .then((respuesta) => {
        if (respuesta.data.respuesta == 1) {
          this.presentAlert('Envio de correo exitoso');
        } else {
          this.presentAlert('Error al enviar el correo');
        }
        loading.dismiss();
      })
      .catch((error) => {
        console.log(error);
        loading.dismiss();
        this.presentAlert('Error grave al enviar el correo');
      });
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async openModalProducto() {
    if (this.idSucursal === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debe seleccionar sucursal facturación',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    if (this.idFormaPago === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debe seleccionar Forma de Pago',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    
    // Resetear valores
    this.cantidad = 0;
    this.codprod = '';
    this.descuento = '';
    this.nprecio = 0;
    this.subtotal_pos = 0;
    this.niva = 0;
    this.total_pos = 0;
    // Abre el modal
    const modal = await this.modalController.create({
      component: AgregarProductosComponent,
      componentProps: {
        materiales: this.materiales,
        bonificacion: this.bonificacion,
        promociones: this.promociones,
        descuento: this.descuento,
        nprecio: this.nprecio,
        nprecio1: this.nprecio1,
        booleanBonificacion: this.booleanBonificacion,
        nneto: this.nneto,
        niva: this.niva,
        nbruto: this.nbruto,
        subtotal_pos: this.subtotal_pos,
        total_pos: this.total_pos,
        venta: this.venta,
        idVenta: this.idVenta,
        promopacks: this.promopacks,
        creaVenta: this.creaVenta
      }
    });

      // Escuchamos el evento que emite el modal al cerrarse
    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        // Aquí obtenemos los datos del modal cerrado y actualizamos las variables necesarias
        const { bonificacion, promociones, descuento, nprecio, nprecio1 } = data.data;
        this.bonificacion = bonificacion;
        this.promociones = promociones;
        this.descuento = descuento;
        this.nprecio = nprecio;
        this.nprecio1 = nprecio1;
      }
    });
    await modal.present();
  }
  
  seleccionaFormaPago(id: number | undefined) {
    if (id !== undefined) {
      this.idFormaPago = id;
    } else {
      // Asigna un valor predeterminado para idFormaPago si id es undefined
      this.idFormaPago = 0; // o cualquier otro valor predeterminado que tenga sentido para tu aplicación
      console.log("selecciona forma pago = undefined");
    }
  }
  

  async openModalVerAdjuntos(ventaId: any) {
    const modal = await this.modalController.create({
      component: AgregarAdjuntosComponent,
      componentProps: {
        venta_id: ventaId,
        archivos: this.archivos,
        is_venta: true
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.archivos) {
        this.archivos = data.data.archivos;
      }
    });

    await modal.present();
  }

  async openModalDespacho(ventaId: any) {
    const modal = await this.modalController.create({
      component: DespachoComponent,
      componentProps: {
        idVenta: ventaId,
        venta: this.venta
      }
    });

    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });

    await modal.present();
  }
  
  async confirmarPedido() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'bubbles',
      cssClass: 'spinner-energized'
    });
    await loading.present();

    this.ventaService.confirmarPedido(this.venta.id).then(async (respuesta) => {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Pedido Confirmado',
        message: respuesta.data,
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['app', 'abbott']);//cambiar este redirect
    }).catch(async (respuesta) => {
      await loading.dismiss();
      console.log(respuesta);
      const alert = await this.alertCtrl.create({
        header: 'Error al Confirmar',
        message: respuesta.data,
        buttons: ['OK']
      });
      await alert.present();
    });
  }
  
  async confirmarGuardarPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Está seguro que desea guardar el pedido?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: () => {
            this.grabarPedido();
          }
        }
      ]
    });
    await alert.present();
  }
  
  
  
  async grabarPedido() {
    const userId = this.userService.getId();
    const insertProds: any[] = [];
  
    for (let i = 0; i < this.venta.productos.length; i++) {
      let destruir = false;
      const materialProd = this.ventaService.getMaterialByCodigo(this.materiales, this.venta.productos[i].material.codigo);
  
      const nuevoProd = {
        pos_venta_clase_id: '2',
        material_id: '' + materialProd.id,
        descripcion: '' + materialProd.descripcion,
        medida_id: '' + materialProd.medida.id,
        precio: '' + this.venta.productos[i].precio,
        cantidad: '' + this.venta.productos[i].cantidad,
        es_muestra: this.venta.productos[i].es_muestra,
        bonificacion: this.venta.productos[i].bonificacion,
        descuento: this.venta.productos[i].descuento,
        promo_asociada: this.venta.productos[i].promo_asociada,
        promo_aplicada: this.venta.productos[i].promo_aplicada,
        cod_pos: this.venta.productos[i].cod_pos,
        _destroy: '' + destruir
      };
  
      insertProds.push(nuevoProd);
    }
  
    const data = {
      'venta': {
        'doc_venta_clase_id': '1',
        'sociedad_id': this.venta.sociedad_id,
        'sociedad_sucursal_id': this.idSucursal,
        'forma_pago_id': this.idFormaPago,
        'type': 'PedidoVenta',
        'user_id': userId,
        'pais_id': '65',
        'cliente_id': this.venta.cliente_id,
        'moneda_id': '29',
        'despacho_clase_id': '1',
        'observaciones': this.venta.observaciones
      }
    };
  
    try {
      const venta = await this.ventaService.postVenta(data);
      const idVenta = venta.id;
  
      const pedidoData = {
        pedido_venta: {
          doc_venta_clase_id: '1',
          sociedad_id: '1',
          sociedad_sucursal_id: this.idSucursal,
          forma_pago_id: this.idFormaPago,
          type: 'PedidoVenta',
          user_id: userId,
          pais_id: '65',
          cliente_id: this.venta.cliente.id,
          moneda_id: '29',
          despacho_clase_id: '1',
          observaciones: this.venta.observaciones,
          pos_ventas_attributes: insertProds
        }
      };
  
      const ventas = await this.ventaService.updateVenta(pedidoData, idVenta);
      if (ventas === undefined) {
        const alertPopupError = await this.alertCtrl.create({
          header: 'Error',
          message: 'Entrega Bloqueada',
          buttons: ['OK']
        });
        await alertPopupError.present();
        this.venta = this.ventaAux;
        this.updateProductos();
      } else {
        this.venta = ventas;
        const alertPopup = await this.alertCtrl.create({
          header: 'Pedido de Venta',
          message: 'Pedido de Venta creada exitosamente',
          buttons: ['OK']
        });
        await alertPopup.present();
        this.router.navigate(['app', 'ventas'], {
          queryParams: { keyUrl: idVenta, idCliente: this.idCliente }
        });
      }
    } catch (error) {
      console.log(error);
      const errorMessage = (error instanceof Error) ? error.toString() : 'Error desconocido';
      const alertPopup = await this.alertCtrl.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alertPopup.present();
    }
  }
  
  updateProductos() {
    let monto_subtotal = 0;
    let monto_iva = 0;
    let monto_total = 0;
  
    for (let i = 0; i < this.venta.productos.length; i++) {
      monto_subtotal += this.venta.productos[i].total_pos;
      monto_iva += this.venta.productos[i].total_pos * 0.19;
      monto_total += monto_subtotal + monto_iva;
    }
  
    this.venta.monto_subtotal = monto_subtotal;
    this.venta.monto_iva = monto_iva;
    this.venta.monto_total = monto_total;
  }
  
  
  seleccionaSucursal(id: number) {
    this.idSucursal = id;
  }
  
}
