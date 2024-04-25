import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'comma2decimal'
})
export class Comma2DecimalPipe implements PipeTransform {
  transform(input: number): string {
    if (input === null || input === undefined) {
      return '';
    }
    return input.toString().replace(',', '.');
  }
}
