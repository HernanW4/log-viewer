import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { getLogLevels, LogLevel, LogMessage } from '../../models/log-message';

@Component({
  selector: 'app-log-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './log-chart.component.html',
  styleUrls: ['./log-chart.component.css']
})
export class LogChartComponent implements OnInit, OnDestroy {
  logFrequencies: { name: string, value: number }[] = [];
  private logSubscription!: Subscription;

  colorScheme: Color = {
    name: 'ColorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2E93fA', '#66DE93', '#FFC400', '#F7685B']
  };
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Log Level';
  showYAxisLabel = true;
  yAxisLabel = 'Count';
  yScaleMax = 10;
  barPadding = 300


  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.logSubscription = this.websocketService.messages$.subscribe(messages => {
      this.calculateFrequencies(messages);
    });
  }

  ngOnDestroy(): void {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }

  private calculateFrequencies(logs: LogMessage[]): void {
    const frequencies = new Map<LogLevel, number>();
    getLogLevels().forEach(level => frequencies.set(level, 0));

    for (const log of logs) {
      if (frequencies.has(log.level)) {
        frequencies.set(log.level, frequencies.get(log.level)! + 1);
      }
    }
    
    this.logFrequencies = Array.from(frequencies, ([name, value]) => ({ name, value }));
  }
}