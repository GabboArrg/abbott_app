import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.component.html',
  styleUrls: ['./agregar-productos.component.scss'],
})
export class AgregarProductosComponent implements OnInit {
  codprod: string = '';
  cantidad: number = 0;
  materiales: any[] = []; // Asegúrate de definir correctamente este arreglo

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeModalProducto() {
    this.modalController.dismiss();
  }

  agregaProducto() {
    // Aquí puedes implementar la lógica para agregar el producto
    console.log('Producto agregado:', this.codprod, 'Cantidad:', this.cantidad);
    this.closeModalProducto();
  }
}
