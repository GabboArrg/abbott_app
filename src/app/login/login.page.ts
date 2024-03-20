import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { LoginService } from 'src/app/login/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData: any = {};
  mail: string = '';
  visible: boolean = false;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ionViewDidEnter() {
    if (this.userService.isLoggedIn()) {
      this.mail = this.userService.getMail() || '';
      this.router.navigate(['/app/home']);
    } else {
      this.visible = true;
    }
  }

  logOut() {
    // Implementar lógica de cierre de sesión
  }

  doLogin() {
    this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    }).then(loading => {
      loading.present();

      const email = this.loginData.email?.toLowerCase() || 'a@a.com';
      const password = this.loginData.password || 'a';

      this.loginService.authAbbott(email, password)
        .then((data: any) => {
          loading.dismiss();
          this.userService.setToken(data);

          console.log("User id:" + this.userService.getId());
          console.log("User mail:" + this.userService.getMail());

          this.mail = this.userService.getMail() || '';
          this.router.navigate(['/app/home']);
        })
        .catch((error: any) => {
          loading.dismiss();
          this.alertCtrl.create({
            message: 'Email o contraseña incorrecta',
            header: 'Error'
          }).then(alert => alert.present());
        });
    });
  }
}
