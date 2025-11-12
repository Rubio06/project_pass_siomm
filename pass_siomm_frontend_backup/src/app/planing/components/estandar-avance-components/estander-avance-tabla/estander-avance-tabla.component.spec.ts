import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstanderAvanceTablaComponent } from './estander-avance-tabla.component';

describe('EstanderAvanceTabla', () => {
    let component: EstanderAvanceTablaComponent;
    let fixture: ComponentFixture<EstanderAvanceTablaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EstanderAvanceTablaComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EstanderAvanceTablaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
