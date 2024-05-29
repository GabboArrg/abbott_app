import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comma2decimal'
})
export class Comma2DecimalPipe implements PipeTransform {
  transform(input: any): string {
    if (input === null || input === undefined) {
      return "0";
    }

    // Redondeamos el número a 0 decimales
    const roundedNumber = Math.round(input);

    // Formateamos el número con separadores de miles usando puntos
    const formattedNumber = roundedNumber.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return formattedNumber;
  }
}
