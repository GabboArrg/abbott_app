import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  mode: string = 'PRD'; // O 'STAGING' dependiendo del ambiente
  mail: string = 'example@mail.com'; // El valor del correo electrónico del usuario

  constructor() {}
}
