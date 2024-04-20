import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/login/services/user.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private loadingController: LoadingController
  ) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner>'
    });
    await loading.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async borraVenta(idVenta: number): Promise<any> {
    await this.presentLoading();

    try {
      const req = {
        method: 'DELETE',
        url: `${environment.API_ABBOTT}ventas/${idVenta}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const respuesta = await this.http.request(req.method, req.url, { headers: req.headers }).toPromise();
      await this.dismissLoading();
      return respuesta;
    } catch (error) {
      await this.dismissLoading();
      throw error;
    }
  }

  async getReSendEmail(id: number): Promise<any> {
    try {
      const req = {
        method: 'GET',
        url: `${environment.API_ABBOTT}ventas/enviar_mail_sucursal/${id}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const respuesta = await this.http.request(req.method, req.url, { headers: req.headers }).toPromise();
      return respuesta;
    } catch (error) {
      throw error;
    }
  }

  async getVenta(idVenta: number): Promise<any> {
    await this.presentLoading();

    try {
      const req = {
        method: 'GET',
        url: `${environment.API_ABBOTT}ventas/${idVenta}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      const respuesta = await this.http.request(req.method, req.url, { headers: req.headers }).toPromise();
      await this.dismissLoading();
      return respuesta;
    } catch (error) {
      await this.dismissLoading();
      throw error;
    }
  }

  async postVenta(data: any): Promise<any> {
    await this.presentLoading();

    try {
      const req = {
        method: 'POST',
        url: `${environment.API_ABBOTT}ventas/`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      const respuesta = await this.http.request(req.method, req.url, { headers: req.headers, body: req.body }).toPromise();
      await this.dismissLoading();
      return respuesta;
    } catch (error) {
      await this.dismissLoading();
      throw error;
    }
  }

  async updateVenta(data: any, id: number): Promise<any> {
    await this.presentLoading();

    try {
      const req = {
        method: 'PATCH',
        url: `${environment.API_ABBOTT}ventas/${id}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      const respuesta = await this.http.request(req.method, req.url, { headers: req.headers, body: req.body }).toPromise();
      await this.dismissLoading();
      return respuesta;
    } catch (error) {
      await this.dismissLoading();
      throw error;
    }
  }

  postDespacho(data: any): Observable<any> {
    const url = environment.API_ABBOTT + 'entregas/';
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, data, { headers }).pipe(
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

}
