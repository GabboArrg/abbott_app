import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-agregar-direccion',
  templateUrl: './agregar-direccion.component.html',
  styleUrls: ['./agregar-direccion.component.scss'],
})
export class AgregarDireccionComponent implements OnInit {

  @Input() comunas: any[] | undefined;
  @Input() regiones: any[] | undefined;
  @Input() sucursal: any;

  selectedDataModal: any = {}; // Agrega esta línea para inicializar selectedDataModal

  // Falta definir la propiedad comunasCliente
  comunasCliente: any[] = []; // Debes agregar esta línea

  constructor(private modalController: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    this.comunas = this.navParams.get('comunas') || [];
    this.regiones = this.navParams.get('regiones') || [];
    this.sucursal = this.navParams.get('sucursal');
  }

  closeModalDireccion() {
    this.modalController.dismiss();
  }

  actualizarComunas() {
    this.comunasCliente = []; // Inicializa comunasCliente
    
    if (this.comunas) { // Verifica si this.comunas no es undefined
      this.comunas.forEach((comuna: any) => {
        if (comuna.region === this.selectedDataModal.region) {
          this.comunasCliente.push(comuna);
        }
      });
    }
  }
  agregarDireccion() {
    // Aquí puedes procesar los datos del formulario
    // Lógica para guardar los datos o realizar otras acciones
    this.modalController.dismiss();
  }
  

}
