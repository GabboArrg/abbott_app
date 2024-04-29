import { Component, Input, OnInit } from '@angular/core';
import { ModalController,AlertController } from '@ionic/angular';
import { VentaService } from 'src/app/services/venta.service';
import { UserService } from 'src/app/login/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.component.html',
  styleUrls: ['./agregar-productos.component.scss'],
})
export class AgregarProductosComponent implements OnInit {
  codprod: any;
  cantidad: any;
  materiales: any[] = [];
  @Input() bonificacion?: number;
  @Input() promociones?: any[];
  @Input() descuento: number;
  @Input() nprecio?: number;
  @Input() nprecio1?: number;
  @Input() booleanBonificacion?: boolean;
  @Input() nneto?: number;
  @Input() niva?: number;
  @Input() nbruto?: number;
  @Input() subtotal_pos?: number;
  @Input() total_pos?: number;
  es_muestra: boolean = false;
  codigo_producto: string | undefined;
  idProducto: any;
  generico_precio: any;
  ventaAux: any;
  promo_aplicada: any;
  promo_asociada: any;
  cod_pos: any;
  idSucursal: number | undefined;
  @Input() venta?: any;
  @Input() idVenta: number | undefined;
  @Input() promopacks: any = [];
  pos_venta_attributes: {
    pos_venta_clase_id: string;
    material_id: string;
    descripcion: string;
    medida_id: string;
    precio: string;
    cantidad: string;
    es_muestra: boolean;
    promo_aplicada: any;
    promo_asociada: any;
    cod_pos: any;
    bonificacion: number;
    descuento: number;
    _destroy: string;
  }[] = [];
  idFormaPago: any;
  @Input() creaVenta: boolean | undefined;//pasar desde venta. revisar
  events: any;


  

  constructor(
    private modalController: ModalController,
    private ventaService: VentaService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private datePipe: DatePipe
    ) {
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


  async agregaProducto() {
    console.log('Producto a agregar:', this.codprod, 'Cantidad:', this.cantidad);
    // Guarda una copia de ventaAux en caso de error
    const ventaAuxCopy = { ...this.ventaAux };
    
    // Obtiene los valores necesarios del componente
    const codprod = this.idProducto;
    const cantidad = this.cantidad;
    let es_muestra = this.es_muestra;
    let promo_aplicada = this.promo_aplicada;
    let promo_asociada = this.promo_asociada;
    let cod_pos = this.cod_pos;
    let bonificacion = this.bonificacion;
    let descuento = this.descuento;
    const precio = this.nprecio;

    // Verifica si se seleccionó una sucursal de facturación
    if (this.idSucursal === 0) {
      const alertPopup = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debe seleccionar sucursal facturación',
        buttons: ['OK']
      });
      await alertPopup.present();
      return;
    }

    // Verifica si se seleccionó una forma de pago
    if (this.idFormaPago === 0) {
      const alertPopup = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debe seleccionar Forma de Pago',
        buttons: ['OK']
      });
      await alertPopup.present();
      return;
    }

    // Inicializa las variables de error e ingreso
    let mError = '';
    let errorIngreso = false;

    // Verifica y ajusta valores
    if (es_muestra === undefined) {
      es_muestra = false;
    }

    if (promo_aplicada === undefined) {
      promo_aplicada = false;
    }

    if (promo_asociada === undefined) {
      promo_asociada = null;
    }

    if (cod_pos === undefined || cod_pos === null) {
      cod_pos = new Date().valueOf();
    }

    if (bonificacion === undefined) {
      bonificacion = 0;
    }

    if (descuento === undefined) {
      descuento = 0;
    }

    // Validaciones
    if (codprod === '') {
      errorIngreso = true;
      mError = 'Debe seleccionar un código de producto';
    }

    if (cantidad <= 0 || cantidad === undefined) {
      errorIngreso = true;
      mError = 'Ingrese una cantidad válida';
    }

    if (bonificacion < 0 || bonificacion === undefined) {
      errorIngreso = true;
      mError = 'Ingrese una bonificación válida';
    }

    if (descuento < 0 || descuento === undefined) {
      errorIngreso = true;
      mError = 'Ingrese un descuento válido';
    }

    // Si hay errores, muestra una alerta y devuelve
    if (errorIngreso) {
      const alertPopup = await this.alertCtrl.create({
        header: 'Error',
        message: mError,
        buttons: ['OK']
      });
      await alertPopup.present();
      return;
    }

    // Ajusta booleanBonificacion
    this.booleanBonificacion = true;

    // Obtiene el nuevo elemento del material
    const nuevoElemento = this.ventaService.getMaterialById(this.materiales, codprod);

    // Crea un nuevo producto
    const nuevoProd = {
      descripcion: nuevoElemento.descripcion,
      pos_venta_clase_id: '2',
      medida_id: '' + nuevoElemento.medida.id,
      cantidad: cantidad,
      precio: this.nprecio,
      subtotal_pos: this.subtotal_pos,
      total_pos: this.total_pos,
      material: {
        codigo: nuevoElemento.codigo,
        nombre: '',
        descripcion: '',
        observacion: ''
      },
      material_tipo_id: nuevoElemento.material_tipo_id,
      es_muestra: es_muestra,
      bonificacion: bonificacion,
      material_id: nuevoElemento.id,
      descuento: descuento,
      promo_aplicada: false,
      promo_asociada: null,
      cod_pos: cod_pos
    };

    // Agrega el nuevo producto a venta.productos
    if (!this.venta.productos) {
      this.venta.productos = [];
    }
    this.venta.productos.push(nuevoProd);
    this.aplicarPromopacks();

    // Prepara pos_venta_attributes para actualizar
    this.pos_venta_attributes = [];
    let destruir = false;
    const materialProd = this.ventaService.getMaterialByCodigo(this.materiales, nuevoProd.material.codigo);
    const nuevoAdd = {
      pos_venta_clase_id: '2',
      material_id: '' + materialProd.id,
      descripcion: '' + materialProd.descripcion,
      medida_id: '' + materialProd.medida.id,
      precio: '' + this.nprecio,
      cantidad: '' + cantidad,
      es_muestra: es_muestra,
      promo_aplicada: promo_aplicada,
      promo_asociada: promo_asociada,
      cod_pos: cod_pos,
      bonificacion: bonificacion,
      descuento: descuento,
      _destroy: '' + destruir
    };

    this.pos_venta_attributes.push(nuevoAdd);

    // Prepara los datos a enviar
    const today = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    const idUsr = this.userService.getId();

    const data = {
      pedido_venta: {
        doc_venta_clase_id: '1',
        sociedad_id: '1',
        sociedad_sucursal_id: this.idSucursal,
        forma_pago_id: this.idFormaPago,
        type: 'PedidoVenta',
        user_id: idUsr + '',
        pais_id: '65',
        cliente_id: this.venta.cliente.id,
        moneda_id: '29',
        despacho_clase_id: '1',
        observaciones: this.venta.observaciones,
        pos_ventas_attributes: this.venta.productos
      }
    };

    // Actualiza los productos
    this.updateProductos();

    // Resetea los valores
    this.codprod = '';
    this.idProducto = '';
    this.cantidad = 0;
    this.es_muestra = false;
    this.promo_aplicada = false;
    this.promo_asociada = null;
    this.cod_pos = null;
    this.bonificacion = 0;
    this.descuento = 0;

    // Cierra el modal y crea uno nuevo
    this.closeModalProducto();


    // Si no se crea la venta, actualiza o muestra un error
    const idVenta = this.idVenta !== undefined ? this.idVenta : 0;
    if (!this.creaVenta) {
      this.ventaService.updateVenta(data, idVenta).then(async ventas => {
          if (!ventas) {
            const alertPopupError = await this.alertCtrl.create({
              header: 'Error',
              message: 'Entrega Bloqueada',
              buttons: ['OK']
            });
            await alertPopupError.present();
            this.venta = ventaAuxCopy;
            this.updateProductos();
          } else {
            this.venta = ventas;
            const alertPopup = await this.alertCtrl.create({
              header: 'Producto',
              message: 'Producto Agregado Correctamente',
              buttons: ['OK']
            });
            await alertPopup.present();
            this.events.publish('CallParentMethod');
          }
        })
        .catch(async error => {
          console.log(error);
          const alertPopup = await this.alertCtrl.create({
            header: 'Error',
            message: error,
            buttons: ['OK']
          });
          await alertPopup.present();
        });
    }
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

  async aplicarPromopacks() {
    await this.ventaService.aplicarPromopacks(this.venta,this.promopacks);
  }


   selecProd(id: string) {
    this.codigo_producto = id;
    const material = this.ventaService.getMaterialByCodigo(this.materiales, id);
    this.idProducto = material.id;
    this.promociones = JSON.parse(material.promocion);
    this.generico_precio = material.precio;
    this.nprecio = material.precio;
    this.nprecio1 = material.precio;
    this.nneto = 0;
    this.niva = 0;
    this.nbruto = 0;
    this.descuento = 0;
    this.bonificacion = 0;
    this.updCantidad(this.cantidad);
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
      this.total_pos = this.redondear(this.total_pos)
    }
  }

  updateProductos() {
    let monto_subtotal = 0;
    let monto_iva = 0;
    let monto_total = 0;
  
    for (let i = 0; i < this.venta.productos.length; i++) {
      monto_subtotal += this.venta.productos[i].total_pos;
      monto_iva += this.venta.productos[i].total_pos * 0.19;
      monto_total += monto_subtotal + monto_iva;
    }
  
    this.venta.monto_subtotal = monto_subtotal;
    this.venta.monto_iva = monto_iva;
    this.venta.monto_total = monto_total;
  }

  redondear(numero: number): number {
    // Implementa aquí la lógica para redondear el número
    return Math.round(numero * 100) / 100;
  }
}
