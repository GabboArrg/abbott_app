import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.component.html',
  styleUrls: ['./agregar-productos.component.scss'],
})
export class AgregarProductosComponent implements OnInit {
  codprod: string = '';
  cantidad: number = 0;
  materiales: any[] = [];
  @Input() bonificacion?: number;
  @Input() promociones?: any[];
  @Input() descuento?: number;
  @Input() nprecio?: number;
  @Input() nprecio1?: number;
  @Input() booleanBonificacion?: boolean;
  @Input() nneto?: number;
  @Input() niva?: number;
  @Input() nbruto?: number;
  @Input() subtotal_pos?: number;
  @Input() total_pos?: number;
  es_muestra: boolean = false;


  

  constructor(private modalController: ModalController) {
    // Inicializar propiedades en el constructor
    this.bonificacion = 0;
    this.promociones = [];
    this.descuento = 0;
    this.nprecio = 0;
    this.nprecio1 = 0;
    this.booleanBonificacion = false;
    this.nneto = 0;
    this.niva = 0;
    this.nbruto = 0;
    this.subtotal_pos = 0;
    this.total_pos = 0;
  }

  ngOnInit() {}

  closeModalProducto() {
    // Devolvemos los datos actualizados al cerrar el modal
    this.modalController.dismiss({
      bonificacion: this.bonificacion,
      promociones: this.promociones,
      descuento: this.descuento,
      nprecio: this.nprecio,
      nprecio1: this.nprecio1
    });
  }

  agregaProducto() {
    // Aquí puedes implementar la lógica para agregar el producto
    console.log('Producto agregado:', this.codprod, 'Cantidad:', this.cantidad);
    this.closeModalProducto();
  }

  updCantidad(cantidad: number): void {
    console.log("UPDATE CANTIDAD");
  
    let bonif1 = 0;
    let dcto1 = 0;
    let neto1 = 0;
  
    let maxval = 0;
  
    if (cantidad < 0) {
      cantidad = 0;
    }
  
    if (this.promociones) {
      this.promociones.sort((a, b) => {
        return a.comprado > b.comprado ? 1 : b.comprado > a.comprado ? -1 : 0;
      });
    }
  
    if (cantidad > 0 && this.promociones) {
      for (const promocion of this.promociones) {
        maxval = promocion.comprado;
        if (promocion.comprado <= cantidad) {
          bonif1 = promocion.bonificacion;
          dcto1 = promocion.descuento;
          neto1 = promocion.precio_neto;
        }
      }
    } else {
      this.bonificacion = 0;
      this.descuento = 0;
    }
  
    this.cantidad = cantidad;
  
    if (neto1 > 0) {
      this.nprecio = neto1;
    } else {
      this.nprecio = this.nprecio1;
    }
  
    if (bonif1 > 0) {
      this.bonificacion = bonif1;
    }
  
    if (dcto1 > 0) {
      this.descuento = dcto1;
    }
  
    this.booleanBonificacion = cantidad > maxval ? false : true;
  
    this.updateTotal();
    this.updateTotales();
  }

  updateTotal(): void {
    let nneto: number;
    let niva: number;
    let nbruto: number;
  
    if (this.descuento && this.nprecio && this.cantidad) {
      if (this.descuento >= 0) {
        nneto = (this.nprecio * this.cantidad) * (1 - (this.descuento / 100));
        niva = this.redondear(nneto * 0.19);
        nbruto = nneto + niva;
      } else {
        nneto = this.cantidad * this.nprecio;
        niva = nneto * 0.19;
        nbruto = nneto + niva;
      }
  
      this.nneto = nneto;
      this.niva = niva;
      this.nbruto = nbruto;
    }
  }

  updDescuento(descuento: number): void {
    // console.log("descuento = " + descuento);
    this.descuento = descuento;
    this.updateTotal();
    this.updateTotales();
  }
  
  
  updateTotales(): void {
    if (this.nprecio && this.cantidad && this.descuento) {
      this.subtotal_pos = this.nprecio * this.cantidad;
      this.total_pos = (this.nprecio * this.cantidad) * (1 - (this.descuento / 100));
    }
  }

  redondear(numero: number): number {
    // Implementa aquí la lógica para redondear el número
    return Math.round(numero * 100) / 100;
  }
}
