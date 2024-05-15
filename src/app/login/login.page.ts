import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/login/services/user.service';
import { LoginService } from 'src/app/login/services/login.service';
import { environment } from 'src/environments/environment';
import {AndroidPermissions} from "@awesome-cordova-plugins/android-permissions/ngx"

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData: any = {};
  mail: string = '';
  visible: boolean = false;
  mode: string = environment.MODE;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions
  ) {}

  ionViewDidEnter() {
    if (this.userService.isLoggedIn()) {
      this.mail = this.userService.getMail() || '';
      this.router.navigate(['/home']);
    } else {
      this.visible = true;
    }
  }

  //ionViewDidEnter() {
  //  this.checkAndRequestPermissions().then(hasPermissions => {
  //    if (hasPermissions) {
  //      if (this.userService.isLoggedIn()) {
  //        this.mail = this.userService.getMail() || '';
  //        this.router.navigate(['/home']);
  //      } else {
  //        this.visible = true;
  //      }
  //   } else {
  //      // Mostrar alerta de que los permisos no fueron concedidos
  //      this.presentAlert('Permisos no concedidos', 'No se han otorgado los permisos necesarios para continuar.');
  //    }
  //  });
  //}

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

          this.mail = this.userService.getMail() || '';
          this.router.navigate(['/home']);
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

  async checkAndRequestPermissions() {
    try {
      // Verificar si ya tienes los permisos
      const readPermission = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
      const writePermission = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
  
      // Si ya tienes los permisos, no es necesario solicitarlos
      if (readPermission.hasPermission && writePermission.hasPermission) {
        console.log('Ya tienes los permisos');
        return true;
      } else {
        // Si no tienes permisos, solicítalos
        console.log('Solicitando permisos...');
        const permissions = [
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ];
        const result = await this.androidPermissions.requestPermissions(permissions);
        
        // Verificar si se concedieron los permisos
        if (result.hasPermission) {
          console.log('Permisos concedidos');
          return true;
        } else {
          console.log('Permisos no concedidos');
          return false;
        }
      }
    } catch (error) {
      console.error('Error al verificar y solicitar permisos', error);
      return false;
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  

}
