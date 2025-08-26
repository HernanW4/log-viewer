import { TestBed } from '@angular/core/testing';

import { AppComponent } from '../app.component';
import { AppTestingModule } from '../testing/testing.module';

describe('WebsocketService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, AppTestingModule],
    }).compileComponents();
});

  it('should be created', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const service = fixture.componentInstance;
    expect(service).toBeTruthy();
  });
});
