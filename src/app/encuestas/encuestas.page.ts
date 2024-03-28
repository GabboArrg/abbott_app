import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.page.html',
  styleUrls: ['./encuestas.page.scss'],
})
export class EncuestasPage {
  mode: string = 'PRD'; // O 'STAGING' dependiendo del ambiente
  mail: string = 'example@mail.com'; // El valor del correo electrónico del usuario
  tituloVarLocal: string | undefined;

  constructor() {}
  ngOnInit() {
    this.tituloVarLocal = 'Encuestas';
  }
}
