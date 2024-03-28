import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/login/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getClientes(): Observable<any> {
    const token = this.userService.getToken();
    const url = `${environment.API_ABBOTT}usuario/clientes?access_token=${token}`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  deleteArchivo(clienteId: string, id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}archivos?cliente_id=${clienteId}&id=${id}`;
    return this.http.delete(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getCliente(id: string): Observable<any> {
    if (id === "0" || id === "0") {
      return new Observable<any>(observer => {
        observer.next(null);
        observer.complete();
      });
    }
    const url = `${environment.API_ABBOTT}clientes/${id}`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getPedidos(id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}cliente_ventas/?id=${id}`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getMonedas(): Observable<any> {
    const url = `${environment.API_ABBOTT}monedas/`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getPaises(): Observable<any> {
    const url = `${environment.API_ABBOTT}paises/`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getComunas(): Observable<any> {
    const url = `${environment.API_ABBOTT}comunas/`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getRegiones(): Observable<any> {
    const url = `${environment.API_ABBOTT}regiones/`;
    return this.http.get(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  postCliente(data: any): Observable<any> {
    const url = `${environment.API_ABBOTT}clientes/`;
    return this.http.post(url, data).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  postSucursal(data: any): Observable<any> {
    const url = `${environment.API_ABBOTT}cliente_sucursales/`;
    return this.http.post(url, data).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  //postAdjunto(id: string, pictureUrl: string): Observable<any> {
    // Aquí puedes implementar la lógica para subir archivos
    // Ten en cuenta que esta función devuelve un Observable
  //}

  //postAdjunto2(id: string, pictureUrl: string): Observable<any> {
    // Aquí puedes implementar la lógica para subir archivos
    // Ten en cuenta que esta función devuelve un Observable
  //}

  patchCliente(data: any, id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}clientes/${id}`;
    return this.http.patch(url, data).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  patchSucursal(data: any, id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}cliente_sucursales?id=${id}`;
    return this.http.patch(url, data).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  deleteSucursal(id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}cliente_sucursales?id=${id}`;
    return this.http.delete(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
}