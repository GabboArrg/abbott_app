import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {
  tituloVarLocal: string | undefined;

  // Variables para almacenar datos del cliente
  cliente: any;
  selectedData: any;
  regiones: any[];
  comunasCliente: any[];

  constructor(private modalController: ModalController
    ) {
      // Inicializa tus propiedades aquí si es necesario
      this.cliente = {};
      this.selectedData = {};
      this.regiones = [];
      this.comunasCliente = [];
    }
  
  ngOnInit() {
    this.tituloVarLocal = 'Crear clientes';
  }

  // Método para solicitar evaluación
  solicitarEvaluacion() {
    // Aquí puedes implementar la lógica para solicitar la evaluación
  }

  // Método para agregar un nuevo cliente
  agregarCliente() {
    // Aquí puedes implementar la lógica para agregar un nuevo cliente
  }
  actualizarComunas() {
    // Implementa la lógica para actualizar las comunas
  }
}
