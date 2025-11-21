import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstandarAvanceComponent } from './estandar-avance-main.component';

describe('EstandarAvance', () => {
    let component: EstandarAvanceComponent;
    let fixture: ComponentFixture<EstandarAvanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EstandarAvanceComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EstandarAvanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
