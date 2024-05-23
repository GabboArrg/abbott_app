import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { VentaService } from 'src/app/services/venta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-crear-despacho-modal',
  templateUrl: './crear-despacho-modal.component.html',
  styleUrls: ['./crear-despacho-modal.component.scss'],
})
export class CrearDespachoComponent implements OnInit {
  despacho_clases: any[] = [];
  @Input() sucursales: any;
  @Input() contactos: any;
  @Input() es_nuevo: any;
  @Input() entregas: any;
  @Input() venta_id: any;
  @Input() venta: any;
  entrega: any;
  tiene_despacho = false;
  tipo_despacho = true;
  hideDespacho = false;
  @Input() nuevaEntrega: any[] = []; // Esto debe ser llenado con los datos adecuados
  idDespacho: number = 0;
  idSucursal: number = 0;
  idContacto: number | undefined;
  fecha_entrega: any;
  observacion: any;
  @Input() maxEntrega: any[] = [];
  seldespacho: any;
  selsucursal: any;
  selcontacto: any;
  despacho_clase: any;
  direccion_despacho: any;
  posiciones: any;
  idCliente!: number;
  idVenta!: number;
  estado: any;
  numero!: number;
  

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private userService: UserService,
    private ventaService: VentaService,
    public loadingCtrl: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.idCliente = +params['idCliente'];
      this.idVenta = +params['idVenta'];
    });
  }

  ngOnInit() {
    //this.estado = this.venta.estado; REVISAR ESTO Y EL ELIMINAR ENTREGA
    console.log("entra a crea despacho, numero: "+ this.venta_id);
    console.log("estado: "+ this.venta.estado);
    this.loadDespachoClases();
    this.loadVariables();
    console.log("entregas: "+ JSON.stringify(this.entregas));
    
    
  }

  loadVariables(){
    if(!this.es_nuevo){
    this.numero = this.venta_id //si no es nuevo, a través de venta_id se pasa el numero de entrega
    this.entrega = this.entregas[this.venta_id-1]
    this.posiciones = this.entrega.posiciones;
    this.seldespacho = this.entrega.despacho_clase;
    this.selsucursal = this.entrega.cliente_sucursal_id;
    this.selcontacto = this.entrega.cliente_contacto;
    this.fecha_entrega = this.entrega.fecha_entrega;
    this.observacion = this.entrega.observacion

    }
  }
  
  async loadDespachoClases() {
    try {
      this.despacho_clases = await this.ventaService.getDespachoClases();
    } catch (error) {
      console.error(error);
    }
  }

  seleccionaDespacho(idDespacho: number) {
    console.log("id despacho: "+ idDespacho);
    this.idDespacho = idDespacho;
    if (idDespacho === 1 || idDespacho === 2) {
      this.tiene_despacho = false;
      this.idSucursal = 0;
    } else {
      this.tiene_despacho = true;
    }
    this.tipo_despacho = idDespacho !== 2;
  }


  getTipoDespacho(tipo_despacho: string, id: number) {
    this.tiene_despacho = !(
      tipo_despacho === 'Retirado por Cliente' || 
      tipo_despacho === 'Retirado por Representante de Ventas'
    );
  }


  
  seleccionaSucursal(idSucursal: number) {
    console.log("sucursal: "+ idSucursal);
    this.idSucursal = idSucursal;
  }

  seleccionaContacto(idContacto: number) {
    console.log("asd: "+ idContacto);
    this.idContacto = idContacto;
  }

  calcularMaximo(itemId: number): number {
    const maxEntregaObj = this.maxEntrega.find(item => item.id === itemId);
    const producto = this.venta.productos.find((prod: { id: number; }) => prod.id === itemId);
    if (maxEntregaObj && producto) {
      return producto.cantidad - maxEntregaObj.acumulado;
    }
    return 0;
  }
  

  async updCantidad(cantidad: number, id: number) {
    // Buscar el objeto correspondiente en maxEntrega usando el id del producto
    const maxEntregaObj = this.maxEntrega.find(item => item.id === id);
  
    if (!maxEntregaObj) {
      console.log("Error: no se encontró la entrega correspondiente para el id proporcionado");
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error: no se encontró la entrega correspondiente para el id proporcionado',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    console.log("acumulado: " + maxEntregaObj.acumulado);
  
    const producto = this.venta.productos.find((prod: { id: number; }) => prod.id === id);
    if (!producto) {
      console.log("Error: no se encontró el producto correspondiente para el id proporcionado");
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Error: no se encontró el producto correspondiente para el id proporcionado',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const cantidadPendiente = producto.cantidad - maxEntregaObj.acumulado;
  
    if (cantidad > cantidadPendiente) {
      console.log("Error: no puede ser mayor a la cantidad pendiente por entregar");
  
      // Actualizar el valor del input con la cantidad pendiente
      cantidad = cantidadPendiente;
  
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
    if (this.idDespacho > 2 && !this.idSucursal) {
      return this.presentAlert('Debe Ingresar la dirección de despacho');
    }

    if (!this.idDespacho) {
      return this.presentAlert('Debe seleccionar tipo de despacho');
    }
    console.log("id contacto: "+this.idContacto);
    console.log("tipo contacto: "+ this.tipo_despacho);
    if (!this.idContacto && this.tipo_despacho) {
      return this.presentAlert('Debe seleccionar un contacto');
    }


    if (this.fecha_entrega !== undefined) {
      const hoy = new Date();
      const fechaEntrega = new Date(this.fecha_entrega);
      if(fechaEntrega < hoy){
        return this.presentAlert('Debe ingresar una fecha correcta');
      }
    }else{
      return this.presentAlert('Debe ingresar una fecha correcta');
    }

    const strFec = formatDate(this.fecha_entrega, 'dd/MM/yyyy', 'en-US');
    let sumCant = 0;

    const entregas_attributes = this.nuevaEntrega.reduce((acc, value, index) => {
      const idaux = this.venta.productos[index].id;
      sumCant += value.cantidad;
    
      if (value.cantidad < 0) {
        this.presentAlert('Debe ingresar una cantidad válida');
        return acc;
      }
    
      acc[index] = {
        pos_venta_id: idaux,
        fecha_entrega: strFec,
        cantidad: value.cantidad
      };
      return acc;
    }, {});

    if (sumCant < 1) {
      return this.presentAlert('La cantidad total debe ser mayor que 0.');
    }

    const data = {
      type: 'PedidoVenta',
      clase: 'VOD',
      pedido_venta: {
        doc_venta_clase_id: '1',
        entregas_attributes
      },
      fecha_entrega: strFec,
      despacho_clase_id: this.idDespacho,
      cliente_sucursal_id: this.idSucursal,
      cliente_contacto_id: this.idContacto,
      venta_id: this.venta.id,
      observacion: this.observacion,
      user_id: this.userService.getId() + ''
    };

    console.log("DATA: "+ JSON.stringify(data));

    const loading = await this.presentLoading();
    this.ventaService.postDespacho(data).subscribe(
      response => {
        loading.dismiss();
        this.presentAlert('Entrega agregada correctamente.', 'Entrega');
        this.closeAllModals();
        this.router.navigate(['/home']);
      },
      error => {
        loading.dismiss();
        this.presentAlert('Error al agregar entrega: ' + error.message);
      }
    );
  }
  
  async closeAllModals() {
    // Aquí llamamos al dismiss() y pasamos un objeto indicando que queremos cerrar el modal padre
    await this.modalController.dismiss({
      closeParentModal: true
    });
  }

  async esUltimaEntrega(): Promise<boolean> {
    try {
      let mayorNumero = 0;
      // Iterar sobre las entregas para encontrar el número mayor
      this.entregas.forEach((entrega: any) => {
        if (entrega.numero > mayorNumero) {
          mayorNumero = entrega.numero;
        }
      });
  
      // Comparar el número mayor encontrado con this.numero
      return mayorNumero === this.numero;
    } catch (error) {
      console.error('Error al determinar si es la última entrega: ', error);
      return false; // En caso de error, retorna false
    }
  }
  

  async eliminarEntrega() {
    if (this.idCliente === undefined || this.venta.id === undefined) {
      console.error('idCliente o idVenta no están definidos');
      return;
    }
  
    try {
      const esUltima = await this.esUltimaEntrega(); // Verificar si es la última entrega
  
      if (!esUltima) {
        this.showErrorAlert('No se puede eliminar esta entrega porque no es la última.');
        return;
      }
  
      const alert = await this.alertController.create({
        header: 'Eliminar Entrega',
        message: '¿Está seguro de eliminar esta entrega?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancelar');
            },
          },
          {
            text: 'Eliminar',
            handler: async () => {
              const loading = await this.loadingCtrl.create({
                message: 'Eliminando entrega...',
                spinner: 'bubbles',
              });
              await loading.present();
    
              this.ventaService.deleteDespacho(this.venta.id, this.numero).then((respuesta) => {
                console.log('Eliminar Entrega', respuesta);
                loading.dismiss();
                this.closeAllModals();
                this.router.navigate(['/home']);
              }).catch((error) => {
                console.log(error);
                loading.dismiss();
                this.showErrorAlert(error.message || 'Error al eliminar');
              });
            },
          },
        ],
      });
    
      await alert.present();
    } catch (error) {
      console.error('Error al eliminar entrega: ', error);
      this.showErrorAlert('Error al eliminar la entrega.');
    }
  }
  

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error al eliminar',
      message,
      buttons: ['OK'],
    });
  
    await alert.present();
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
