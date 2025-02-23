import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtouserComponent } from './howtouser.component';

describe('HowtouserComponent', () => {
  let component: HowtouserComponent;
  let fixture: ComponentFixture<HowtouserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowtouserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtouserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
