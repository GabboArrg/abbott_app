import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  isLoggedIn(): boolean {
    // Verificar si el token de usuario está presente en el almacenamiento local
    return !!localStorage.getItem("token");
  }

  logOut(): Promise<void> {
    return new Promise((resolve) => {
      // Limpiar el almacenamiento local al cerrar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("mail");
      resolve();
    });
  }
  

  setToken(data: any): void {
    const token = data.usuario.access_token;
    const id = data.usuario.id;
    const mail = data.usuario.email;
    const nombre = data.usuario.nombre;

    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("mail", mail);
    localStorage.setItem("nombre", nombre);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getId(): string | null {
    return localStorage.getItem("id");
  }

  getMail(): string | null {
    return localStorage.getItem("mail");
  }

  getNombre(): string | null {
    return localStorage.getItem("nombre");
  }
}
