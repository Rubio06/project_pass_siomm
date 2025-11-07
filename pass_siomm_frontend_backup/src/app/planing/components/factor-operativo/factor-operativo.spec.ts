import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorOperativo } from './factor-operativo';

describe('FactorOperativo', () => {
  let component: FactorOperativo;
  let fixture: ComponentFixture<FactorOperativo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactorOperativo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactorOperativo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
