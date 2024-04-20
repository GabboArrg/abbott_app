import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.scss'],
})
export class ClienteModalComponent implements OnInit {
  
  clientesFiltrados: any[] = [];
  @Input() clientes: any[] = []; // Cambiar el nombre del atributo
  @Input() clienteSeleccionado: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // Al abrir el modal, mostrar todos los clientes inicialmente
    this.clientesFiltrados = this.clientes;
  }

  seleccionarCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.modalController.dismiss(cliente);
  }

  cerrarModal() {
    this.modalController.dismiss(this.clienteSeleccionado);
  }

  buscarCliente(event: any) {
    const termino = event.target.value;
    if (!termino) {
      // Si el término de búsqueda está vacío, mostrar todos los clientes
      this.clientesFiltrados = this.clientes;
      return;
    }

    // Filtrar los clientes cuyo nombre contenga el término de búsqueda
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  }
  
}
