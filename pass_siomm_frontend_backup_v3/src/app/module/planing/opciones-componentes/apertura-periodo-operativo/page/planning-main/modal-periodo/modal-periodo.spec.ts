import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPeriodo } from './modal-periodo';

describe('ModalPeriodo', () => {
  let component: ModalPeriodo;
  let fixture: ComponentFixture<ModalPeriodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPeriodo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPeriodo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
