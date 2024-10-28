import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevAdminComponent } from './dev-admin.component';

describe('DevAdminComponent', () => {
  let component: DevAdminComponent;
  let fixture: ComponentFixture<DevAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
