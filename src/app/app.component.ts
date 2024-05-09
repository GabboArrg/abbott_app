import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavigationStart,Router } from '@angular/router';
import { UserService } from 'src/app/login/services/user.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  showSidebar = false; 
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
