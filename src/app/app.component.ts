import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';
import { UserService } from 'src/app/login/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  showSidebar = false;
  nombre: string = '';
  saludo: string = '';
  darkMode = false;

  constructor(
    private router: Router, 
    private menu: MenuController, 
    private userService: UserService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showSidebar = this.userService.isLoggedIn();
      }
    });
  }

  ngOnInit() {
    const userNombre = this.userService.getNombre();
    if (userNombre) {
      this.nombre = userNombre;
    }
    this.checkAppMode();
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

  toggleDarkMode(){
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if(this.darkMode){
      localStorage.setItem('darkModeActivated', 'true');
    }else{
      localStorage.setItem('darkModeActivated', 'false');
    }
  }

  checkAppMode(){
    const checkIsDarkMode = localStorage.getItem('darkModeActivated');
    checkIsDarkMode == 'true'
    ? (this.darkMode = true)
    : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode)
  }

  closeSidebarAndNavigate(route: string) {
    // Cierra el sidebar
    this.menu.close('sidebar');

    // Navega a la ruta especificada
    this.router.navigateByUrl(route);
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
