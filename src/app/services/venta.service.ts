import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoadingController, AlertController } from '@ionic/angular';
import { UserService } from '../login/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  
  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private userService: UserService,
    private alertCtrl: AlertController
  ) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'bubbles',
      translucent: true
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

  getMaterialByCodigo(arr: any[], codigo: string) {
    for (let d = 0, len = arr.length; d < len; d += 1) {
      if (arr[d].codigo === codigo) {
        return arr[d];
      }
    }
  }

  getMaterialById = function(arr: string | any[], id: any) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
      if (arr[d].id === id) {
        return arr[d];
      }
    }
  }

  aplicarPromopacks(venta: any, promopacks: any): void {
    if (venta.productos.length > 1) {
      // material_tipo_id
      console.log('Hay más de una posición, buscando promopacks...');
      let promo_packs = promopacks;
      let dcto = 0;
      let descuento_promo = 0;
      let p1 = 0;
      let p2 = 0;
      let sum = 0;
      let posiciones: any[] = [];
      let nombre = '';
      let promopack_id = '';
  
  
      for (let j = 0; j < venta.productos.length; j++) {
        const element1 = venta.productos[j];
  
        promo_packs.sort((a: any, b: any) => {
          if (a.cantidad2 > b.cantidad2) {
            return -1;
          }
          if (a.cantidad2 < b.cantidad2) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
  
        let descuento = 0;
  
        promo_packs.forEach((promopack: any) => {
          console.log('c2 ' + promopack.cantidad2);
          if (promopack.material_id === element1.material_id && promopack.cantidad1 === element1.cantidad) {
            console.log('Promoción encontrada para material ' + element1.nombre + ' de posición ' + (j + 1));
            sum = 0;
            for (let k = 0; k < venta.productos.length; k++) {
              if (j !== k && venta.productos[k].material_tipo_id === promopack.material_tipo_id) {
                sum += venta.productos[k].cantidad;
                posiciones[k] = true;
              } else {
                posiciones[k] = false;
              }
            }
            posiciones[j] = true;
            dcto = 0;
            // Promoción encontrada
            if (sum >= promopack.cantidad2 && promopack.descuento >= descuento) {
              nombre = promopack.nombre;
              promopack_id = promopack.id;
              console.log('Promoción aplicada para material ' + element1.material_id + ' de posición ' + (j + 1));
              descuento = promopack.descuento;
              // Ajusta las variables de promoción aplicada
              const promo_aplicada = true;
              const promo_asociada = promopack.id;
            }
          }
        });
  
        // Actualiza posiciones
        if (descuento > 0) {
          nombre = nombre + ' (' + descuento + '%)';
          this.alertCtrl.create({
            header: 'Promoción Encontrada',
            message: nombre,
            buttons: ['OK']
          }).then(alertPopup => {
            alertPopup.present();
          });
  
          for (let k = 0; k < venta.productos.length; k++) {
            if (posiciones[k] && venta.productos[k].descuento < descuento) {
              venta.productos[k].promo_asociada = promopack_id;
              venta.productos[k].promo_aplicada = true;
              venta.productos[k].descuento = descuento;
              venta.productos[k].total_pos =
                (venta.productos[k].precio * venta.productos[k].cantidad) *
                (1 - descuento / 100);
            }
          } // next k
        }
      } // next j
    }
  }
  


}
