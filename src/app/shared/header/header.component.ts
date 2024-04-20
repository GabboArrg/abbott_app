import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() tituloVar: string | undefined;
  @Input() editar: boolean | undefined; // Nueva entrada para la variable booleana editar

  constructor() {}

  ngOnInit() {}
}

