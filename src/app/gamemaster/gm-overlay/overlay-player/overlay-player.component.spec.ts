import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayPlayerComponent } from './overlay-player.component';

describe('OverlayPlayerComponent', () => {
  let component: OverlayPlayerComponent;
  let fixture: ComponentFixture<OverlayPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
