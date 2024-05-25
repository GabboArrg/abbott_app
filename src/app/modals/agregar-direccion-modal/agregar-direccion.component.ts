import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.component.html',
  styleUrls: ['./agregar-direccion.component.scss'],
})
export class AgregarDireccionComponent implements OnInit {

  comunas: any[] | undefined;
  regiones: any[] | undefined;
  sucursal: any = {
    cliente_id: '',
    nombre: '',
    recibe: '',
    pais_id: '41',
    ciudad: '',
    region: '',
    comuna: '',
    direccion: '',
    telefono: '',
    movil: '',
    email: '',
    codpostal: '',
    req_adicionales: '',
    selectedData:{
      region: { id: '', nombre: '' },
      comuna: { id: '', nombre: '' }
    },
    is_new: "true",
    _destroy: "false"
  };
  
  comunasCliente: any[] = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController
  ) { }

  ngOnInit() {

  }

  closeModalDireccion() {
    this.modalController.dismiss();
  }

  actualizarComunas() {
    this.comunasCliente = []; 
    if (this.comunas) { 
      this.comunas.forEach((comuna: any) => {
        if (comuna.region === this.sucursal.selectedData.region.id) {
          this.comunasCliente.push(comuna);
        }
      });
    }
  }

  agregarDireccion() {
    if (!this.validarCampos()) {
      return;
    }
    this.modalController.dismiss({
      sucursal: this.sucursal
    });
  }

  validarCampos() {
    if (!this.sucursal.nombre) {
      this.mostrarAlerta('Error', 'Debe agregar el Nombre de la Sucursal.');
      return false;
    } else if (!this.sucursal.recibe) {
      this.mostrarAlerta('Error', 'Debe agregar el nombre de quien Recibe.');
      return false;
    } else if (!this.sucursal.selectedData.region) {
      this.mostrarAlerta('Error', 'Debe Seleccionar una Región.');
      return false;
    } else if (!this.sucursal.selectedData.comuna) {
      this.mostrarAlerta('Error', 'Debe Seleccionar una Comuna.');
      return false;
    } else if (!this.sucursal.ciudad) {
      this.mostrarAlerta('Error', 'Debe agregar una Ciudad.');
      return false;
    } else if (!this.sucursal.direccion) {
      this.mostrarAlerta('Error', 'Debe agregar una Dirección.');
      return false;
    } else if (!this.sucursal.telefono) {
      this.mostrarAlerta('Error', 'Debe agregar un Teléfono.');
      return false;
    } else if (!this.sucursal.email) {
      this.mostrarAlerta('Error', 'Debe agregar un Email válido (ejemplo@email.cl).');
      return false;
    }
    return true;
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

}
