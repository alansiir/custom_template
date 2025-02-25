import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrototypeUiComponent } from './prototype-ui.component';

describe('PrototypeUiComponent', () => {
  let component: PrototypeUiComponent;
  let fixture: ComponentFixture<PrototypeUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrototypeUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrototypeUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
