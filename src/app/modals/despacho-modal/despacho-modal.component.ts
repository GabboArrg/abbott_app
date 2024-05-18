import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { VentaService } from 'src/app/services/venta.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { CrearDespachoComponent } from 'src/app/modals/crear-despacho-modal/crear-despacho-modal.component';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho-modal.component.html',
  styleUrls: ['./despacho-modal.component.scss'],
})
export class DespachoComponent implements OnInit {
  @Input() idVenta: number | undefined;
  @Input() venta: any;
  materiales: any = {};
  material: any = {};
  idProducto: string = '';
  cantidad: number = 0;
  pos_venta_attributes: any[] = [];
  booleanBonificacion: boolean = true;
  cliente: any;
  contactos: any;
  sucursales: any;
  entregas: any[] = [];
  nuevaentrega: any[] = [];
  fecha_entrega: any;
  observacion: string = '';
  despacho_clases: any = {};
  maxEntrega: any[] = [];
  direcciones: any[] = [];
  es_muestra: boolean = false;
  tiene_despacho: boolean = false;
  tipo_despacho: boolean = true;
  hideEntrega: boolean = false;

  idContacto: number = 0;
  idDireccion: number = 0;
  txtDireccion: any;
  hideDespacho: boolean = false;
  total_productos: number = 0;
  total_entregado: number = 0;
  DEFAULT_PAGE_SIZE_STEP: number = 5;
  currentPage: number = 1;
  pageSize: number = this.currentPage * this.DEFAULT_PAGE_SIZE_STEP;
  

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private ventaService: VentaService,
    private alertController: AlertController,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.initData();
  }

  async initData() {
    const loading = await this.presentLoading();
    this.fecha_entrega = new Date();

    try {
      this.despacho_clases = await this.ventaService.getDespachoClases();
      this.entregas = this.venta.entregas;

      this.maxEntrega = this.venta.productos.map((p: { id: any; cantidad: any; }) => ({
        id: p.id,
        acumulado: 0,
        cantidad_max: p.cantidad
      }));

      this.total_entregado = 0;
      this.total_productos = 0;

      if (typeof this.entregas === 'string') {
        this.entregas = [];
        this.hideEntrega = false;
      } else {
        this.hideEntrega = true;
        console.log("entregas: "+ this.entregas);
        console.log("entregas length: "+ this.entregas.length);
        this.entregas.forEach(entrega => {
          entrega.posiciones.forEach((posicion: { cantidad_entregada: string; }, j: number) => {
            const entregado = parseInt(posicion.cantidad_entregada, 10);
            this.maxEntrega[j].acumulado += entregado;
            this.total_entregado += entregado;
          });
        });
        this.venta.productos.forEach((producto: { cantidad_total: string; }) => {
          this.total_productos += parseInt(producto.cantidad_total, 10);
        });
      }

      if (this.total_productos > this.total_entregado) {
        this.hideEntrega = false;
      }
      this.nuevaentrega = this.venta.productos.map((producto: { id: number; material: { codigo: any; }; es_muestra: any; cantidad: any; bonificacion: any; }, d: number) => ({
        id: d,
        pos_venta_id: producto.id,
        codigo: producto.material.codigo,
        es_muestra: producto.es_muestra,
        cantidad: producto.cantidad + producto.bonificacion - this.maxEntrega[d].acumulado
      }));

      
      this.clienteService.getCliente(this.venta.cliente.id.toString()).subscribe((data: any) => {
        this.cliente = data.cliente;
        this.txtDireccion = data.cliente.direccion;
        this.sucursales = data.cliente.cliente_sucursales;
        this.contactos = data.cliente.cliente_contactos;
      });

      loading.dismiss();
    } catch (error: any) {
      console.error(error);
      loading.dismiss();
    }
  }

  getTipoDespacho(tipo_despacho: string, id: number) {
    this.tiene_despacho = !(
      tipo_despacho === 'Retirado por Cliente' || 
      tipo_despacho === 'Retirado por Representante de Ventas'
    );
  }

  setEstadoPedido2(estado: string) {
    return estado === 'espera_confirmacion';
  }







  seleccionaDireccion(idDireccion: number) {
    this.idDireccion = idDireccion;
  }

  findAndRemove(array: any[], property: string, value: any) {
    const index = array.findIndex(item => item[property] === value);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }



  updCantidad(cantidad: number, id: number) {
    if (cantidad > (this.venta.productos[id].cantidad - this.maxEntrega[id].acumulado)) {
      this.presentAlert('Error no puede ser mayor a la cantidad pendiente por entregar');
    }
  }

  //direccionC(direccion_despacho: string) {
  //  this.direccion_despacho = direccion_despacho;
  //}

  //updDescuento(descuento: number) { // mirada rapida, funcion innecesaria
  //  this.descuento = descuento;
  //}

  async openModalCrearEntrega(ventaId: any) {
    const modal = await this.modalController.create({
      component: CrearDespachoComponent,
      componentProps: {
        venta_id: ventaId
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.archivos) {
        //this.archivos = data.data.archivos;
      }
    });

    await modal.present();
  }

  openModal() {
    console.log("cliente: "+JSON.stringify(this.venta.cliente));
    console.log("contactos: "+JSON.stringify(this.venta.cliente.cliente_contactos));
    if (!this.cliente.cliente_contactos) {
      this.presentAlert('El cliente no tiene contactos ingresados.');
      return;
    }

    if (!this.cliente.cliente_sucursales) {
      this.presentAlert('El cliente no tiene direcciones ingresadas.');
      return;
    }

    if (this.hideEntrega) {
      this.presentAlert('Ya no hay más productos por despachar');
      return;
    }

    this.router.navigate(['app.nuevoDespacho', { keyUrl: this.idVenta }]);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  entregaSeleccionada(numero: number) {
    this.router.navigate(['app.verDespacho', { keyUrl: this.idVenta, numero }]);
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...'
    });
    await loading.present();
    return loading;
  }

  async presentAlert(message: string, title: string = 'Error') {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
