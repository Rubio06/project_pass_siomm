import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMobileComponent } from './list-mobile.component';

describe('Secundaria', () => {
    let component: ListMobileComponent;
    let fixture: ComponentFixture<ListMobileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListMobileComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ListMobileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
