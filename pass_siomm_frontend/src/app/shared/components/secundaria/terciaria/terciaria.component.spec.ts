import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerciariaComponent } from './terciaria.component';

describe('Terciaria', () => {
  let component: TerciariaComponent;
  let fixture: ComponentFixture<TerciariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerciariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerciariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
