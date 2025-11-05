import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuartaComponent } from './cuarta.component';

describe('Cuarta', () => {
  let component: CuartaComponent;
  let fixture: ComponentFixture<CuartaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuartaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuartaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
