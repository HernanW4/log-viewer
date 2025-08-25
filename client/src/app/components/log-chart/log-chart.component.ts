import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Subscription, timer } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { getLogLevels, LogLevel, LogMessage } from '../../models/log-message';

const PROCESS_LOGS_INTERVAL = 5000; //process logs every 5 seconds to update chart
const TOTAL_TIMEFRAMES_TO_SHOW = 10; // Always display the last 10 timeframes (e.g., 10 minutes)
const TIMEFRAME_DURATION_MS = 120000; // 2 minutes (2 * 60 * 1000)
const MINIMUM_Y_AXIS_HEIGHT = 10; 

@Component({
  selector: 'app-log-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './log-chart.component.html',
  styleUrls: ['./log-chart.component.css']
})
export class LogChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  chartData: {name: string, series: {name: string, value: number}[]}[] = [];

  private timerSubscription!: Subscription;

  colorScheme: Color = {
    name: 'ColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [ "var(--color-debug)", 'var(--color-info)', 'var(--color-warn)', 'var(--color-error)']
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Count';
  yScaleMax = MINIMUM_Y_AXIS_HEIGHT;
  barPadding = 10;


  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.processLogsIntoTimeframes([]);

    this.timerSubscription = timer(0, PROCESS_LOGS_INTERVAL).subscribe(() => {
      this.processLogsIntoTimeframes(this.websocketService.getCurrentMessages());
    })
  }

  ngAfterViewInit(): void{
    this.updateBarPadding();
  }

  @HostListener("window:resize")
  onResize(): void{
    this.updateBarPadding();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

private processLogsIntoTimeframes(logs: LogMessage[]): void {
    const logsByTimeframe = new Map<string, { [key in LogLevel]: number }>();
    for (const log of logs) {
      const timestamp = new Date(log.timestamp).getTime();
      const timeframeStart = timestamp - (timestamp % TIMEFRAME_DURATION_MS);
      const timeframeKey = new Date(timeframeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!logsByTimeframe.has(timeframeKey)) {
        logsByTimeframe.set(timeframeKey, { DEBUG: 0, INFO: 0, WARN: 0, ERROR: 0 });
      }
      logsByTimeframe.get(timeframeKey)![log.level]++;
    }

    const now = Date.now();
    const latestTimeframeStart = now - (now % TIMEFRAME_DURATION_MS);
    const finalChartData = [];
    let maxTotalLogsInWindow = 0;

    for (let i = TOTAL_TIMEFRAMES_TO_SHOW - 1; i >= 0; i--) {
      const timeframeTimestamp = latestTimeframeStart - (i * TIMEFRAME_DURATION_MS);
      const timeframeKey = new Date(timeframeTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const logCounts = logsByTimeframe.get(timeframeKey);
      let totalLogsInTimeframe = 0;
      let series: { name: string; value: number; }[] = [];

      if (logCounts) {
        series = getLogLevels().map(level => {
          totalLogsInTimeframe += logCounts[level];
          return { name: level, value: logCounts[level] };
        });
      } else {
        series = getLogLevels().map(level => ({ name: level, value: 0 }));
      }
      
      finalChartData.push({ name: timeframeKey, series });
      
      if (totalLogsInTimeframe > maxTotalLogsInWindow) {
        maxTotalLogsInWindow = totalLogsInTimeframe;
      }
    }

    const newYMax = Math.ceil(maxTotalLogsInWindow * 1.5); // the 1.5 makes it a bit nicer so the chart it's fully filled
    this.yScaleMax = Math.max(MINIMUM_Y_AXIS_HEIGHT, newYMax);
    
    this.chartData = finalChartData;
  }
  private updateBarPadding(): void {
    if (!this.chartContainer || this.chartData.length === 0) {
      return;
    }

    const containerWidth = this.chartContainer.nativeElement.offsetWidth;
    const barCount = this.chartData.length;
    const maxBarWidth = 10; 
    const minPadding = 8; 

    
    const spacePerBar = (containerWidth / barCount);
    const currentBarWidth = spacePerBar - minPadding;

    if (currentBarWidth > maxBarWidth) {
      this.barPadding = spacePerBar - maxBarWidth;
    } else {
      this.barPadding = minPadding;
    }
  }
}