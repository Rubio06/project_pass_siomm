import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaMensualLabores } from './programa-mensual-labores';

describe('ProgramaMensualLabores', () => {
  let component: ProgramaMensualLabores;
  let fixture: ComponentFixture<ProgramaMensualLabores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramaMensualLabores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaMensualLabores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
