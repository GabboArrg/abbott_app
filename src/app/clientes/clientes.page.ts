import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {
  mode: string = 'PRD'; // O 'STAGING' dependiendo del ambiente
  mail: string = 'example@mail.com'; // El valor del correo electrónico del usuario
  tituloVarLocal: string | undefined;

  constructor() {}
  ngOnInit() {
    this.tituloVarLocal = 'Crear clientes';
  }
}
