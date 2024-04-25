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
import { environment } from 'src/environments/environment';//aqui está el service, la url

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
  socSucursales: any = {};
  idSucursal: number = 0;
  idFormaPago: number = 0;
  socSucursal: any = {};
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
      console.log("El cliente seleccionado en venta es = " + this.idCliente);
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
        console.log("cliente id antes de cs: "+ this.idCliente);
        console.log("idventa id antes de cs: "+ this.idVenta);
        this.clienteService.getCliente(this.idCliente.toString()).subscribe((data: any) => {
          this.venta.cliente.email = data.email;
          this.venta.cliente.estado = data.estado;
          this.venta.cliente.nombre = data.nombre;
        });

        this.ventaService.getFormaPago(this.idCliente).subscribe((resp: any) => {
          // Imprimir cada campo de la respuesta
          console.log("Respuesta de forma de pago:", resp.forma_pago);
          console.log("Nombre de la forma de pago:", resp.forma_pago[0].nombre);
          console.log("ID de la forma de pago:", resp.forma_pago[0].id);
          console.log("Código de aduana de la forma de pago:", resp.forma_pago[0].codigo_aduana);
          
          // Asignar los datos a las variables correspondientes
          this.formaPagos = Object.values(resp.forma_pago);
          this.formaPagoDefecto = resp.forma_pago_defecto;
          this.selformapago = this.formaPagoDefecto;
          this.idFormaPago = this.selformapago;
        
          // Imprimir otros datos relevantes para la depuración
          console.log("Forma de pago por defecto:", this.formaPagoDefecto);
          console.log("ID del cliente:", this.idCliente);
        }, (error: any) => {
          console.log("Error en getFormaPago = " + error);
        });
        
      } else {
        this.creaVenta = false;
        this.idVenta = this.idVenta;
        console.log("venta id"+ this.idVenta);
        console.log("venta id"+ this.venta);
        this.ventaService.getVenta(this.idVenta).subscribe((venta: any) => {
          this.venta = venta;
          this.venta.observaciones = venta.observacion;
          this.idSucursal = this.venta.sucursal_facturacion.id;
          this.idFormaPago = this.venta.forma_pago.id;
          this.socSucursal = this.venta.sucursal_facturacion;
          this.selsucursal = this.socSucursal;
          this.formaPago = this.venta.forma_pago;
          this.selformapago = this.formaPago;
          this.idCliente = this.venta.cliente.id;
          

          this.ventaService.getFormaPago(this.idCliente).subscribe((resp: any) => {
            this.formaPagos = Object.values(resp.forma_pago);
            this.formaPagoDefecto = resp.forma_pago_defecto;
          }, (error: any) => {
            console.log("Error en getFormaPago = " + error);
          });

          this.archivos = [];
          if (venta.archivos !== undefined && Array.isArray(venta.archivos)) {
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

    this.ventaService.getSocSucursal().subscribe(
      resp => {
        this.socSucursales = resp;
        loading.dismiss();
      },
      error => {
        console.log("Error en getSociSucursal = " + error);
        loading.dismiss();
      }
    );
  }

  async cargarMateriales() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'spinner-energized'
    });
    await loading.present();

    this.ventaService.getMateriales().subscribe(
      materiales => {
        this.materiales = materiales;
        loading.dismiss();
      },
      error => {
        console.log(error);
        loading.dismiss();
      }
    );
  }

  async cargarPromopacks() {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      cssClass: 'spinner-energized'
    });
    await loading.present();

    this.ventaService.getPromopacks().subscribe(
      promopacks => {
        this.promopacks = promopacks;
        loading.dismiss();
      },
      error => {
        console.log(error);
        loading.dismiss();
      }
    );
  }

  selecProd(id: string) {
    this.codigo_producto = id;
    const material = this.getMaterialByCodigo(this.materiales, id);
    this.idProducto = material.id;
    this.promociones = JSON.parse(material.promocion);
    this.generico_precio = material.precio;
    // Las siguientes propiedades deberían ser declaradas en la clase
    // this.nprecio = material.precio;
    // this.nprecio1 = material.precio;
    // this.tiene_bonificacion = material.tiene_bonificacion;
    // this.nneto = 0;
    // this.niva = 0;
    // this.nbruto = 0;
    // this.descuento = 0;
    // this.bonificacion = 0;
    // this.updCantidad(this.cantidad);
    // this.updateTotal();
    // this.updateTotales();
  }

  async despacho() {
    this.navCtrl.navigateForward('/despacho/' + this.idVenta);
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


  getMaterialByCodigo(arr: any[], codigo: string) {
    for (let d = 0, len = arr.length; d < len; d += 1) {
      if (arr[d].codigo === codigo) {
        return arr[d];
      }
    }
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
        // Pasa los parámetros necesarios al componente del modal si es necesario
      }
    });
    await modal.present();
  }
  
  seleccionaFormaPago(id: number | undefined) {
    if (id !== undefined) {
      this.idFormaPago = id;
      console.log("selecciona forma pago = " + id);
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
        venta_id: ventaId
      }
    });
    await modal.present();
  }
  
  closeModalVerAdjuntos() {
    this.ver_adjuntos.hide();
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
  

  
  async grabarPedido() {
    const userId = this.userService.getId();
    const insertProds: any[] = [];
  
    for (let i = 0; i < this.venta.productos.length; i++) {
      let destruir = false;
      const materialProd = this.getMaterialByCodigo(this.materiales, this.venta.productos[i].material.codigo);
  
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
