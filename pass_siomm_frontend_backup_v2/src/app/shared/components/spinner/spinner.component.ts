import { Component, inject, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/module/planing/services/loading.service';

@Component({
    selector: 'app-spinner',
    imports: [],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
    private loadingService = inject(LoadingService);

    spinner = this.loadingService.spinner;

}
