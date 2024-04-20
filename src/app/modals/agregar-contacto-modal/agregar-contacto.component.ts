import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.component.html',
  styleUrls: ['./agregar-contacto.component.scss'],
})
export class AgregarContactoComponent implements OnInit {

  contacto = {
    nombre: '',
    email: '',
    telefono: '',
    especialidad: ''
  };

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeModalDireccion() {
    // Utiliza el método dismiss() para cerrar el modal
    this.modalController.dismiss();
  }

  agregarContacto() {
    // Aquí puedes procesar los datos del formulario
    console.log('Contacto:', this.contacto);
    // Lógica para guardar los datos o realizar otras acciones
    this.modalController.dismiss();
  }

}
