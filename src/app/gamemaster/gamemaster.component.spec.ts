import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemasterComponent } from './gamemaster.component';

describe('GamemasterComponent', () => {
  let component: GamemasterComponent;
  let fixture: ComponentFixture<GamemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamemasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
