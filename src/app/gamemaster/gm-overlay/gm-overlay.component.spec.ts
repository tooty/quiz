import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmOverlayComponent } from './gm-overlay.component';

describe('GmOverlayComponent', () => {
  let component: GmOverlayComponent;
  let fixture: ComponentFixture<GmOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
