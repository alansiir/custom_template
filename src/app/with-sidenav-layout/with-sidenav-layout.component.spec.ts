import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithSidenavLayoutComponent } from './with-sidenav-layout.component';

describe('WithSidenavLayoutComponent', () => {
  let component: WithSidenavLayoutComponent;
  let fixture: ComponentFixture<WithSidenavLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithSidenavLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithSidenavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
