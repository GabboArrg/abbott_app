import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage {
  mode: string = 'PRD'; // O 'STAGING' dependiendo del ambiente
  mail: string = 'example@mail.com'; // El valor del correo electrónico del usuario
  tituloVarLocal: string | undefined;

  constructor() {}
  ngOnInit() {
    this.tituloVarLocal = 'Pedidos';
  }
}
