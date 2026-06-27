import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Geology } from './geology';

describe('Geology', () => {
  let component: Geology;
  let fixture: ComponentFixture<Geology>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Geology]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Geology);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
