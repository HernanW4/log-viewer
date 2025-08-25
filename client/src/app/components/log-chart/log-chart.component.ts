import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Subscription, timer } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { getLogLevels, LogLevel, LogMessage } from '../../models/log-message';

const PROCESS_LOGS_INTERVAL = 5000;
const TOTAL_TIMEFRAMES_TO_SHOW = 10;
const TIMEFRAME_DURATION_MS = 120000;
const MINIMUM_Y_AXIS_HEIGHT = 10; 


type GroupedLogs = Map<string, { [key in LogLevel]: number }>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartDataResult = { chartData: {name: string, series: any[]}[], maxLogCount: number };


@Component({
  selector: 'app-log-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './log-chart.component.html',
  styleUrls: ['./log-chart.component.css']
})
export class LogChartComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() isChartVisible: boolean = true; 

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
  barPadding = 3;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.processLogsIntoTimeframes(this.websocketService.getCurrentMessages());

    if (this.isChartVisible){
      this.startTimer();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChartVisible']) {
      if (this.isChartVisible) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }
  }

  ngOnDestroy(): void {
    this.stopTimer(); 
  }


  private startTimer(): void {
    if (this.timerSubscription) { return; } 
    
    this.timerSubscription = timer(0, PROCESS_LOGS_INTERVAL).subscribe(() => {
      this.processLogsIntoTimeframes(this.websocketService.getCurrentMessages());
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.timerSubscription as any) = null;
    }
  }

  //My attempt to refactor this function from previous iterations
  //It was massive.

  private processLogsIntoTimeframes(logs: LogMessage[]): void {
    const groupedLogs = this.groupLogsByTimeframe(logs);
    const { chartData, maxLogCount } = this.buildChartData(groupedLogs);

    const newYMax = Math.ceil(maxLogCount * 1.5);
    this.yScaleMax = Math.max(MINIMUM_Y_AXIS_HEIGHT, newYMax);
    this.chartData = chartData;
  }

  // Groups all logs in the same timeframe depicted by TIMEFRAME_DURATION_MS
  private groupLogsByTimeframe(logs: LogMessage[]): GroupedLogs {
    const logsByTimeframe: GroupedLogs = new Map();
    const allLogLevels = { DEBUG: 0, INFO: 0, WARN: 0, ERROR: 0 };

    for (const log of logs) {
      const timestamp = new Date(log.timestamp).getTime();
      const timeframeStart = timestamp - (timestamp % TIMEFRAME_DURATION_MS);
      const timeframeKey = new Date(timeframeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!logsByTimeframe.has(timeframeKey)) {
        logsByTimeframe.set(timeframeKey, { ...allLogLevels });
      }
      logsByTimeframe.get(timeframeKey)![log.level]++;
    }
    return logsByTimeframe;
  }

  // Building the final chart data for ngx-chart
  private buildChartData(groupedLogs: GroupedLogs): ChartDataResult {
    const finalChartData = [];
    let maxTotalLogsInWindow = 0;
    const now = Date.now();
    const latestTimeframeStart = now - (now % TIMEFRAME_DURATION_MS);

    for (let i = TOTAL_TIMEFRAMES_TO_SHOW - 1; i >= 0; i--) {
      const timeframeTimestamp = latestTimeframeStart - (i * TIMEFRAME_DURATION_MS);
      const timeframeKey = new Date(timeframeTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const logCounts = groupedLogs.get(timeframeKey);
      let totalLogsInTimeframe = 0;
      
      const series = getLogLevels().map(level => {
        const value = logCounts?.[level] ?? 0;
        totalLogsInTimeframe += value;
        return { name: level, value };
      });
      
      finalChartData.push({ name: timeframeKey, series });
      
      if (totalLogsInTimeframe > maxTotalLogsInWindow) {
        maxTotalLogsInWindow = totalLogsInTimeframe;
      }
    }

    return { chartData: finalChartData, maxLogCount: maxTotalLogsInWindow };
  }
  
}