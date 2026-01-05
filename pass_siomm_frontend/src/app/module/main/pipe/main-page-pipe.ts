import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replaceUnderscore'
})
export class MainPagePipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        return value ? value.toString().replace(/_/g, ' ') : '';
    }
}
