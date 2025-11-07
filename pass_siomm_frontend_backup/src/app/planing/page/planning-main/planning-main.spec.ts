import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningMainComponent } from './planning-main.component';

describe('PlanningMain', () => {
    let component: PlanningMainComponent;
    let fixture: ComponentFixture<PlanningMainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlanningMainComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlanningMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
