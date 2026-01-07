import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorOperativoTablaComponent } from './factor-operativo-tabla.component';

describe('FactorOperativoTabla', () => {
    let component: FactorOperativoTablaComponent;
    let fixture: ComponentFixture<FactorOperativoTablaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FactorOperativoTablaComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FactorOperativoTablaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
