import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any, format: string = 'dd-MM-yyyy'): any {
    if (!value) return '';

    // Si value es una cadena, intentamos convertirla a un objeto Date
    if (typeof value === 'string') {
      const parts = value.split('-');
      if (parts.length === 3) {
        value = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      } else {
        // Si la cadena no está en el formato esperado, devolvemos la cadena original
        return value;
      }
    }

    // Formateamos la fecha usando DatePipe
    return new DatePipe('en-US').transform(value, format);
  }
}
