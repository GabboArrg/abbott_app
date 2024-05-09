import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-ver-foto',
  templateUrl: './ver-foto.component.html',
  styleUrls: ['./ver-foto.component.scss'],
})
export class VerFotoComponent {
  @Input() archivo_url: any;
  @ViewChild('zoomContainer', { static: false }) zoomContainer!: ElementRef;
  @ViewChild('zoomImage', { static: false }) zoomImage!: ElementRef;
  initialScale = 1;
  pinchStartDistance = 0;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  onPinchStart(event: any) {
    if (event.touches.length >= 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      this.pinchStartDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
    }
  }

  onPinchMove(event: any) {
    if (event.touches.length >= 2 && this.zoomImage) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const pinchCurrentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scale = pinchCurrentDistance / this.pinchStartDistance;
      this.zoomImage.nativeElement.style.transform = `scale(${this.initialScale * scale})`;
    }
  }

  onPinchEnd(event: any) {
    this.initialScale = parseFloat(this.zoomImage.nativeElement.style.transform.replace('scale(', '').replace(')', ''));
  }

}
