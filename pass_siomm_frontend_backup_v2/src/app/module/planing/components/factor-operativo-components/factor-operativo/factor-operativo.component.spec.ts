import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FactorOperativoComonent } from './factor-operativo.component';


describe('FactorOperativo', () => {
    let component: FactorOperativoComonent;
    let fixture: ComponentFixture<FactorOperativoComonent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FactorOperativoComonent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FactorOperativoComonent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
