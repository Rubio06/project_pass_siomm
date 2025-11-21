import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemimcalLaboratory } from './chemimcal-laboratory';

describe('ChemimcalLaboratory', () => {
  let component: ChemimcalLaboratory;
  let fixture: ComponentFixture<ChemimcalLaboratory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemimcalLaboratory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChemimcalLaboratory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
