import { Component } from '@angular/core';
import { AperPerOperComponent } from '../../components/periodo/periodo..component';
import { FactorOperativo } from '../../components/factor-operativo/factor-operativo';
import { ValoresComponent } from '../../components/valores/valores.component';

@Component({
  selector: 'app-planning-main',
  imports: [AperPerOperComponent, FactorOperativo, ValoresComponent],
  templateUrl: './planning-main.component.html',
  styleUrl: './planning-main.component.css',
})
export class PlanningMainComponent {
    
}
