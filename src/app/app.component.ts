import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';
import { UserService } from 'src/app/login/services/user.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  showSidebar = false;
  nombre: string = '';
  saludo: string = '';

  constructor(
    private router: Router, 
    private menu: MenuController, 
    private userService: UserService,
    private themeService: ThemeService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showSidebar = this.userService.isLoggedIn();
      }
    });
  }

  ngOnInit() {
    // Obtener el nombre del usuario del servicio
    const userNombre = this.userService.getNombre();
    console.log("nombre: " + userNombre);
    if (userNombre) {
      this.nombre = userNombre;
    }

    // Calcular el saludo adecuado
    this.saludo = this.getSaludo();
  }

  getSaludo(): string {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) {
      return 'Que tenga un buen día!';
    } else if (hora >= 12 && hora < 18) {
      return 'Que tenga una buena tarde!';
    } else {
      return 'Que tenga una buena noche!';
    }
  }

  closeSidebarAndNavigate(route: string) {
    // Cierra el sidebar
    this.menu.close('sidebar');

    // Navega a la ruta especificada
    this.router.navigateByUrl(route);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.userService.logOut().then(() => {
      // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
      this.router.navigate(['/login']);
    }).catch((error: any) => {
      console.log("Error al cerrar sesión:", error);
    });
  }
}
