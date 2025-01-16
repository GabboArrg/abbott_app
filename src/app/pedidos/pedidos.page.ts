import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
import { ActivatedRoute } from '@angular/router';
import { ClienteModalComponent } from 'src/app/modals/cliente-modal/cliente-modal.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: 'pedidos.page.html',
  styleUrls: ['pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  clientes: any[] = [];
  cliente: any = "";
  ventas: any[] = [];
  clienteSeleccionado: number = 0;
  verpedidos: boolean = false;
  idCliente: number = 0;
  LastidCliente: number = 0;
  currentPage: number = 1;
  pageSize: number = 5; // Definir el tamaño de página por defecto
  tituloVarLocal: string | undefined;
  selcli: any = null;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public clienteService: ClienteService,
    public ventaService: VentaService,
    public route: ActivatedRoute,
    private modalController: ModalController
  ) {
    this.obtenerClientes();
  }

  ngOnInit(): void {
    this.tituloVarLocal = 'Pedidos';
  }

  async obtenerClientes() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando clientes...',
    });
    await loading.present();

    this.clienteService.getClientes().subscribe(
      (response: any) => { // Utiliza la interfaz ResponseData aquí
        this.clientes = response.clientes;
        loading.dismiss();
      },
      (error) => {
        console.log(error);
        loading.dismiss();
      }
    );
  }

  obtienePedidos(id: number) {
    if (this.selcli.id != this.LastidCliente && this.selcli.estado == "sin_evaluacion") {
      this.LastidCliente = this.cliente.id;
      this.mostrarAlerta('Advertencia', 'Cliente sin evaluación, recuerde realizar solicitud');
    }
    return this.clienteService.getPedidos(id.toString());
  }

  ventaSeleccionada(idCliente: number, idVenta: number) {
    if (Number(idVenta) <= 0) {
      this.mostrarAlerta('Atención', 'Debe seleccionar una venta');
      return;
    }
    this.navCtrl.navigateForward(`/ventas/${idCliente}/${idVenta}`);
  }
  

  nuevaVenta() {
    if (Number(this.idCliente) <= 0) {
      this.mostrarAlerta('Atención', 'Debe seleccionar un cliente');
      return;
    }
    this.navCtrl.navigateForward(`/ventas/${this.idCliente}/0`);
  }


  verCliente() {
    if (Number(this.idCliente) <= 0) {
      this.mostrarAlerta('Atención', 'Debe seleccionar un cliente');
      return;
    }
    this.navCtrl.navigateForward(`/clientes/${this.idCliente}`);
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  setEstadoPedido(estado: string): boolean {
    return estado === 'confirmado';
  }

  setEstadoPedido2(estado: string): boolean {
    return estado === 'espera_confirmacion';
  }

  loadNextPage() {
    this.currentPage++;
    this.pageSize = this.currentPage * DEFAULT_PAGE_SIZE_STEP;
  }

  //modal
  async openModal() {
    const modal = await this.modalController.create({
      component: ClienteModalComponent,
      componentProps: {
        clientes: this.clientes, // Pasar la matriz de clientes dentro del objeto
        clienteSeleccionado: this.selcli // Pasar el cliente seleccionado
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.role === 'cancel') {
        console.log('Modal cerrado sin selección');
      } else {
        this.selcli = data.data; // Actualiza selcli con el cliente seleccionado
        if (this.selcli) {
          this.idCliente = this.selcli.id;
          this.obtienePedidos(this.idCliente).subscribe(
            (ventas) => {
              this.ventas = ventas.ventas; // Asignar los pedidos al array ventas
              if (this.ventas.length > 0) {
                this.verpedidos = true;
              } else {
                this.verpedidos = false;
              }

            },
            (error) => {
              console.log(error);
            }
          );
        }
        // Aquí puedes hacer lo que necesites con el cliente seleccionado
      }
    });

    return await modal.present();
  }
}

const DEFAULT_PAGE_SIZE_STEP = 5;
