import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-crear-despacho-modal',
  templateUrl: './crear-despacho-modal.component.html',
  styleUrls: ['./crear-despacho-modal.component.scss'],
})
export class CrearDespachoComponent implements OnInit {
  despacho_clases: any[] = []; // Esto debe ser llenado con los datos adecuados
  sucursales: any[] = []; // Esto debe ser llenado con los datos adecuados
  contactos: any[] = []; // Esto debe ser llenado con los datos adecuados
  tiene_despacho = false;
  tipo_despacho = true;
  hideDespacho = false;
  nuevaEntrega: any[] = []; // Esto debe ser llenado con los datos adecuados
  idDespacho: number = 0;
  idSucursal: number = 0;
  idContacto: number | undefined;
  fecha_entrega: any;
  venta: any;
  observacion: any;
  maxEntrega: any[] = [];
  seldespacho: any;
  selsucursal: any;
  selcontacto: any;
  
  

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService,
    private ventaService: VentaService,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
  }

  seleccionaDespacho(idDespacho: number) {
    this.idDespacho = idDespacho;
    if (idDespacho === 1 || idDespacho === 2) {
      this.tiene_despacho = false;
      this.idSucursal = 0;
    } else {
      this.tiene_despacho = true;
    }
    this.tipo_despacho = idDespacho !== 2;
  }

  seleccionaSucursal(idSucursal: number) {
    this.idSucursal = idSucursal;
  }

  seleccionaContacto(idContacto: number) {
    this.idContacto = idContacto;
  }

  async updCantidad(cantidad: number, id: number) {
    if (cantidad > (this.venta.productos[id].cantidad - this.maxEntrega[id].acumulado)) {
      console.log("Error: no puede ser mayor a la cantidad pendiente por entregar");
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error: no puede ser mayor a la cantidad pendiente por entregar',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  }

  async agregaEntrega() {
    let entregas_attributes = {};
    let fecha_entrega = this.fecha_entrega;
    let observacion = this.observacion;
    let booleanError = false;
    let mError = '';

    const hoy = new Date();
    const fec = new Date(this.fecha_entrega.getFullYear(), this.fecha_entrega.getMonth(), this.fecha_entrega.getDate());

    if ((this.idDespacho > 2) && (this.idSucursal == 0 || this.idSucursal == undefined)) { //(this.idSucursal == 0 || this.idSucursal == '')) {
      mError = "Debe Ingresar la dirección de despacho";
      booleanError = true;
    }

    if (this.idDespacho == 0) {
      mError = "Debe seleccionar tipo de despacho";
      booleanError = true;
    }

    if (this.idContacto == 0 && this.tipo_despacho == true) {
      mError = "Debe seleccionar un contacto";
      booleanError = true;
    }

    if (fec < hoy) {
      mError = "Debe ingresar una fecha correcta";
      booleanError = true;
    }

    const strFec = this.fecha_entrega.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

    if (booleanError) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: mError,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    let sumCant = 0;

    this.nuevaEntrega.forEach((value, index) => {
      const idaux = this.venta.productos[index].id;
      sumCant += value.cantidad;

      if (value.cantidad < 0) {
        mError = "Debe ingresar una cantidad válida";
      }

      let entregas_attributes: any[] = [];      
      entregas_attributes[index] = {
        "pos_venta_id": idaux,
        "fecha_entrega": strFec,
        "cantidad": value.cantidad
      };
    });

    if (sumCant < 1) {
      mError = "La cantidad total debe ser mayor que 0.";
      booleanError = true;
    }

    if (booleanError) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: mError,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const data = {
      "type": "PedidoVenta",
      "clase": "VOD",
      "pedido_venta": {
        "doc_venta_clase_id": "1", //$scope.doc_venta_clase_id
        "entregas_attributes": entregas_attributes
      },
      "fecha_entrega": strFec,
      "despacho_clase_id": this.idDespacho, //$scope.doc_venta_clase_id
      "cliente_sucursal_id": this.idSucursal, // TODO $scope.cliente_sucursal_id,
      "cliente_contacto_id": this.idContacto,
      "venta_id": this.venta.id,
      "observacion": this.observacion,
      "user_id": this.userService.getId() + ""
    };

    const loading = await this.presentLoading();
    try {
      const entrega = await this.ventaService.postDespacho(data);

      const alert = await this.alertController.create({
        header: 'Entrega',
        message: 'Entrega agregada correctamente.',
        buttons: ['OK']
      });
      await alert.present();

      //this.closeModal();
      //this.router.navigate(['app.despacho', { keyUrl: idVenta }]);
      this.hideDespacho = false;
      loading.dismiss();
    } catch (error: any) {
      console.log(error.data.error);

      const alert = await this.alertController.create({
        header: 'Error',
        message: error.data.error,
        buttons: ['OK']
      });
      await alert.present();

      this.hideDespacho = false;
      loading.dismiss();
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async presentAlert(message: string, title: string = 'Error') {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...'
    });
    await loading.present();
    return loading;
  }
}
