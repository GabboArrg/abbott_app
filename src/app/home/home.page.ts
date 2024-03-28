import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/login/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  mode: string = environment.MODE;
  mail: string = ''; // El valor del correo electrónico del usuario
  ver: string = '1.0.0';
  tituloVarLocal: string | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Obtener el correo electrónico del usuario del almacenamiento local
    const userMail = this.userService.getMail();
    if (userMail) {
      this.mail = userMail;
    }
    console.log(userMail);

    // Asignar un valor a miVariable
    this.tituloVarLocal = 'Inicio';
  }
}

