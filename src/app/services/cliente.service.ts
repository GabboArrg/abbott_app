import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/login/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  getFiles(idCliente: any): Observable<any[]> {
    // Realiza una solicitud HTTP para obtener los archivos del cliente con el id proporcionado
    return this.http.get<any[]>(`${environment.API_URL}/clientes/${idCliente}/archivos`);
  }

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



  async deleteArchivo(clienteId: any, idArchivo: string): Promise<any> {
    const req = {
      method: 'DELETE',
      url: `${environment.API_ABBOTT}archivos?cliente_id=${clienteId}&id=${idArchivo}`,
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json' // Añadir esta línea para manejar respuestas de texto
    };

    try {
      const respuesta = await this.http.request(req.method, req.url, { headers: req.headers, responseType: 'text' }).toPromise();
      return respuesta;
    } catch (error) {
      throw error;
    }
  }

  getCliente(id: string): Observable<any> {
    if (id === "0" || id === "0" || id === null) {
      return new Observable<any>(observer => {
        observer.next(null);
        observer.complete();
      });
    }
    const url = `${environment.API_ABBOTT}clientes/${id}`;
    console.log("url: "+url)
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
    const apiURL = environment.API_ABBOTT + 'clientes/';
    console.log("entra al postcliente: "+apiURL);
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(apiURL, data, { headers })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  postSucursal(data: any): Observable<any> {
    const apiURL = environment.API_ABBOTT + 'cliente_sucursales/';
    console.log("entra al postSucursal: "+apiURL);
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(apiURL, data, { headers })
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }



  patchCliente(data: any, id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}clientes/${id}`;
    console.log("entra a patchcliente: "+url);
    return this.http.patch(url, data).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  patchSucursal(data: any, id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}cliente_sucursales?id=${id}`;
    console.log("entra al patchsucursal: "+ url);
    return this.http.patch(url, data).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    let errorMsg = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error del cliente: ${error.error.message}`;
    } else {
      errorMsg = `Error del servidor: ${error.status} - ${error.message}`;
    }
    return throwError(errorMsg);
  }

  deleteSucursal(id: string): Observable<any> {
    const url = `${environment.API_ABBOTT}cliente_sucursales?id=${id}`;
    console.log("entra al deletesurucusal: "+url);
    return this.http.delete(url).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
}
