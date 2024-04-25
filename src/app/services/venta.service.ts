import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../login/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  
  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private userService: UserService
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

  // Otros métodos omitidos por brevedad...

  postVenta(data: any): Promise<any> {
    this.presentLoading();

    const req = {
      method: 'POST',
      url: environment.API_ABBOTT + 'ventas/',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data
    };

    return new Promise((resolve, reject) => {
      this.http.request(req.method, req.url, { headers: req.headers, body: req.data })
        .toPromise()
        .then((respuesta: any) => {
          const venta = respuesta.data.venta;
          resolve(venta);
        })
        .catch((error: any) => {
          reject(error);
        })
        .finally(() => {
          this.dismissLoading();
        });
    });
  }

  // Otros métodos omitidos por brevedad...

  getSocSucursal(): Observable<any> {
    const url = environment.API_ABBOTT + 'sociedad_sucursales/';
    return this.http.get(url).pipe(
      catchError((error: any) => {
        return throwError(error.json().error || 'Server error');
      })
    );
  }

  getMateriales(): Observable<any> {
    this.presentLoading();
    const url = environment.API_ABBOTT + 'materiales/';
    return this.http.get(url).pipe(
      catchError((error: any) => {
        return throwError(error.json().error || 'Server error');
      }),
      // Cierre del loading en la suscripción
      finalize(() => {
        this.dismissLoading();
      })
    );
  }

  getPromopacks(): Observable<any> {
    this.presentLoading();
    const url = environment.API_ABBOTT + 'promopacks/';
    return this.http.get(url).pipe(
      catchError((error: any) => {
        return throwError(error.json().error || 'Server error');
      }),
      // Cierre del loading en la suscripción
      finalize(() => {
        this.dismissLoading();
      })
    );
  }

  getReSendEmail(id: number | string): Promise<any> {
    if (id === "0" || id === 0) {
      return Promise.resolve(null);
    }

    const url = `${environment.API_ABBOTT}ventas/enviar_mail_sucursal/${id}`;
    const req = {
      method: 'GET',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      this.http.request(req.method, req.url, { headers: req.headers })
        .toPromise()
        .then((respuesta: any) => {
          resolve(respuesta);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  confirmarPedido(idVenta: number): Promise<any> {
    const idUsr = this.userService.getId(); // Suponiendo que getId() es un método del servicio UserService para obtener el ID de usuario

    const url = `${environment.API_ABBOTT}confirmar_entregas?venta_id=${idVenta}&user_id=${idUsr}`;
    const req = {
      method: 'POST',
      url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      this.http.request(req.method, req.url, { headers: req.headers })
        .toPromise()
        .then((respuesta: any) => {
          resolve(respuesta);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  deleteArchivo(ventaId: any, id: any): Observable<any> {
    const url = environment.API_ABBOTT + 'archivos?venta_id=' + ventaId + '&id=' + id;
    return this.http.delete(url).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getFormaPago(idCliente: number): Observable<any> {
    const url = environment.API_ABBOTT + 'forma_pagos?cliente_id=' + idCliente;
    console.log("url: "+url);
    return this.http.get<any>(url)
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }


  getArchivos(): Observable<any[]> {
    const url = environment.API_ABBOTT + 'archivos'; // Reemplaza esto con la URL correcta
    return this.http.get<any[]>(url);
  }
  

  getVenta(idVenta: any): Observable<any> {
    const url = environment.API_ABBOTT + 'ventas/' + idVenta;
    return this.http.get(url).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateVenta(data: any, id: number): Promise<any> {
    this.presentLoading();

    const req = {
      method: 'PATCH',
      url: `${environment.API_ABBOTT}ventas/${id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data
    };

    return new Promise((resolve, reject) => {
      this.http.request(req.method, req.url, { headers: req.headers, body: req.data })
        .toPromise()
        .then((respuesta: any) => {
          const venta = respuesta.data.venta;
          this.dismissLoading();
          resolve(venta);
        })
        .catch((error: any) => {
          this.dismissLoading();
          reject(error);
        });
    });
  }

}
