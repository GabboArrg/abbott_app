import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input() tituloVar: string | undefined; // Define una propiedad con @Input() para recibir la variable desde el componente padre
  
  constructor() { }

  ngOnInit() {}

}
