import { ComponentFixture, TestBed} from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { LogChartComponent } from './log-chart.component';
import { WebsocketService } from '../../services/websocket.service';
import { LogLevel, LogMessage } from '../../models/log-message';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'ngx-charts-bar-vertical-stacked',
  template: '',
  standalone: true,
})
class MockNgxChartsComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() results: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() scheme: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() xAxis: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() yAxis: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() barPadding: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() legend: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() gradient: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() showXAxisLabel: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() yScaleMax: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() showYAxisLabel: any;
}

const mockWebsocketService = jasmine.createSpyObj('WebsocketService', ['getCurrentMessages']);


describe('LogChartComponent', () => {
  let component: LogChartComponent;
  let fixture: ComponentFixture<LogChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogChartComponent], 
      providers: [
       
        { provide: WebsocketService, useValue: mockWebsocketService },
      ],
    })
    .overrideComponent(LogChartComponent, {
   
      remove: { imports: [NgxChartsModule] },
      add: { imports: [MockNgxChartsComponent] },
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Initialization and Timer', () => {

    it('should unsubscribe from the timer on destroy', () => {
      fixture.detectChanges();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subscription = (component as any).timerSubscription;
      spyOn(subscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(subscription.unsubscribe).toHaveBeenCalled();
    });
  });



  describe('processLogsIntoTimeframes Logic', () => {
    it('should correctly process an empty array of logs', () => {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).processLogsIntoTimeframes([]);

      expect(component.chartData.length).toBe(10);
      expect(component.chartData[0].series.length).toBe(4); // DEBUG, INFO, WARN, ERROR
      expect(component.chartData[0].series[0].value).toBe(0);
      expect(component.yScaleMax).toBe(10); // Should be the MINIMUM_Y_AXIS_HEIGHT
    });


    it('should correctly calculate yScaleMax based on log counts', () => {
      const now = new Date();
      const logs: LogMessage[] = Array(10).fill(0).map(() => ({
          timestamp: now.toISOString(),
          level: LogLevel.WARN,
          message: 'warning',
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).processLogsIntoTimeframes(logs);

      const expectedYMax = Math.ceil(10 * 1.5);
      expect(component.yScaleMax).toBe(expectedYMax);
    });
  });


});