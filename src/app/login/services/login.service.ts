import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  setToken(data: any) {
    throw new Error('Method not implemented.');
  }
  getMail() {
    throw new Error('Method not implemented.');
  }
  getId() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  authAbbott(email: string, password: string): Promise<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const body = {
      'session': {
        email,
        password
      }
    };

    const url = environment.API_ABBOTT + 'login';

    return new Promise((resolve, reject) => {
      this.http.post(url, body, { headers }).subscribe(
        (data: any) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

