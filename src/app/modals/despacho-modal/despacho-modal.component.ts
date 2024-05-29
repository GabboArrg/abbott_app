import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { VentaService } from 'src/app/services/venta.service';
import { ClienteService } from 'src/app/services/cliente.service';
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
  nuevaEntrega: any[] = [];
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
    private ventaService: VentaService,
    private alertController: AlertController,
    private clienteService: ClienteService,
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
        this.entregas.forEach(entrega => {
          entrega.posiciones.forEach((posicion: { pos_venta_id: number; cantidad_entregada: string; }) => {
            const entregado = parseInt(posicion.cantidad_entregada, 10);
            // Buscar el objeto correspondiente en maxEntrega usando el pos_venta_id
            const maxEntregaObj = this.maxEntrega.find(item => item.id === posicion.pos_venta_id);
            if (maxEntregaObj) {
              maxEntregaObj.acumulado += entregado;
              this.total_entregado += entregado;
            }
          });
        });


      }
      
      this.venta.productos.forEach((producto: { cantidad_total: any; }) => {
        this.total_productos += parseInt(producto.cantidad_total, 10);
      });

      if (this.total_productos > this.total_entregado) {
        this.hideEntrega = false;
      }
      this.nuevaEntrega = this.venta.productos.map((producto: { id: number; material: { codigo: any; }; es_muestra: any; cantidad: any; bonificacion: any; }) => ({
        id: producto.id,
        pos_venta_id: producto.id,
        codigo: producto.material.codigo,
        es_muestra: producto.es_muestra,
        cantidad: producto.cantidad + producto.bonificacion - (this.maxEntrega.find(e => e.id === producto.id)?.acumulado || 0)
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
  

  findAndRemove(array: any[], property: string, value: any) {
    const index = array.findIndex(item => item[property] === value);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  async openModalCrearEntrega(id: any, es_nuevo: any) {
  if (es_nuevo){
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
  }

  const modal = await this.modalController.create({
    component: CrearDespachoComponent,
    componentProps: {
      venta_id: id,
      sucursales: this.sucursales,
      contactos: this.contactos,
      entregas: this.entregas,
      es_nuevo: es_nuevo,
      venta: this.venta,
      nuevaEntrega: this.nuevaEntrega,
      maxEntrega: this.maxEntrega
    }
  });

    modal.onDidDismiss().then((data) => {
      if (data !== null && data.data && data.data.closeParentModal) {
        this.modalController.dismiss(); // Cierra el modal padre si se recibe la señal
      }
    });

    await modal.present();
  }


  dismiss() {
    this.modalController.dismiss();
  }

  entregaSeleccionada(numero: number) {
    this.openModalCrearEntrega(numero,false);
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
