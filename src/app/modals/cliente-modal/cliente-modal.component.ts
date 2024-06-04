import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.scss'],
})
export class ClienteModalComponent implements OnInit {
  
  clientesFiltrados: any[] = [];
  @Input() clientes: any[] = [];
  @Input() clienteSeleccionado: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
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
    const termino = event.target.value.toLowerCase();
    if (!termino) {
      this.clientesFiltrados = this.clientes;
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(termino) || cliente.rut.toLowerCase().includes(termino)
    );
  }
}
