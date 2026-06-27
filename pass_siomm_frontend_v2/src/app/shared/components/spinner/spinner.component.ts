import { Component, inject } from '@angular/core';
import { SpinnerService } from './service/spinner.service';

@Component({
    selector: 'app-spinner',
    imports: [],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
    isLoading = inject(SpinnerService).isLoading;
}
