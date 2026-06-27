import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-panel-principal',
    templateUrl: './panel-principal.component.html',
    styleUrls: ['./panel-principal.component.css'],
    imports: [RouterOutlet]
})
export class PanelPrincipalComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        
    }
}
