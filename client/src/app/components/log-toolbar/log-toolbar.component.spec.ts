import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogToolbarComponent } from './log-toolbar.component';

describe('LogToolbarComponent', () => {
  let component: LogToolbarComponent;
  let fixture: ComponentFixture<LogToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogToolbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
