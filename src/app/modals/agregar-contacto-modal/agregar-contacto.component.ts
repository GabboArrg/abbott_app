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
    especialidad: '',
    is_new: true
  };

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeModalDireccion() {
    this.modalController.dismiss();
  }

  agregarContacto() {
    this.modalController.dismiss({
      contacto: this.contacto
    });
  }

}