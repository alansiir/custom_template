import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenLayoutComponent } from './fullscreen-layout.component';

describe('FullscreenLayoutComponent', () => {
  let component: FullscreenLayoutComponent;
  let fixture: ComponentFixture<FullscreenLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullscreenLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
