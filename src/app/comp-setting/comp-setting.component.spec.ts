import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompSettingComponent } from './comp-setting.component';

describe('CompSettingComponent', () => {
  let component: CompSettingComponent;
  let fixture: ComponentFixture<CompSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
