import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDesktopComponent } from './list-desktop.component';

describe('Secundaria', () => {
  let component: ListDesktopComponent;
  let fixture: ComponentFixture<ListDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
