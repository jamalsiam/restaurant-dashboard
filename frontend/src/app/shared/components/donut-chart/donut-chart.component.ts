import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
  output,
  viewChild,
  ElementRef,
  afterNextRender,
  DestroyRef,
  inject,
  PLATFORM_ID,
  effect,
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DecimalPipe } from '@angular/common';
import * as echarts from 'echarts/core';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  TooltipComponentOption,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

// Register necessary ECharts components for maximum performance and tree-shaking
echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, SVGRenderer]);

type ECOption = echarts.ComposeOption<PieSeriesOption | TooltipComponentOption>;

export interface DonutChartSegment {
  id?: string;
  label: string;
  value: number;
  color: string;
  hoverColor?: string;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** Chart host element */
  readonly chartHost = viewChild<ElementRef<HTMLDivElement>>('chartHost');

  /** Raw segment data */
  readonly segments = input<DonutChartSegment[]>([]);

  /** Explicit total override if different from sum */
  readonly total = input<number | undefined>(undefined);

  /** Visual diameter in pixels */
  readonly size = input<number>(220);

  /** Donut stroke / ring thickness (optional) */
  readonly thickness = input<number>(22);

  /** Center sublabel shown when no slice is hovered */
  readonly centerLabel = input<string>('Total Items');

  /** Center main value override */
  readonly centerValue = input<string | null>(null);

  /** Show built-in legend below or beside the chart */
  readonly showLegend = input<boolean>(false);

  /** ARIA label for screen readers */
  readonly ariaLabel = input<string>('Data distribution donut chart');

  /** Event emitted when hovering a segment */
  readonly segmentHover = output<DonutChartSegment | null>();

  /** Event emitted when clicking a segment */
  readonly segmentClick = output<DonutChartSegment>();

  /** Active hovered segment */
  readonly hoveredSegment = signal<DonutChartSegment | null>(null);

  /** ECharts instance reference */
  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;

  /** Total calculated sum */
  readonly calculatedTotal = computed(() => {
    const explicitTotal = this.total();
    if (explicitTotal !== undefined && explicitTotal > 0) {
      return explicitTotal;
    }
    return this.segments().reduce((sum, s) => sum + (s.value || 0), 0);
  });

  /** Dynamic display for center value */
  readonly displayCenterValue = computed(() => {
    const hovered = this.hoveredSegment();
    if (hovered) {
      return new Intl.NumberFormat().format(hovered.value);
    }
    const override = this.centerValue();
    if (override !== null) {
      return override;
    }
    return new Intl.NumberFormat().format(this.calculatedTotal());
  });

  /** Dynamic display for center label */
  readonly displayCenterLabel = computed(() => {
    const hovered = this.hoveredSegment();
    if (hovered) {
      return hovered.label;
    }
    return this.centerLabel();
  });

  /** Dynamic display for center percentage */
  readonly displayCenterPercentage = computed(() => {
    const hovered = this.hoveredSegment();
    const total = this.calculatedTotal();
    if (hovered && total > 0) {
      return `${Math.round((hovered.value / total) * 100)}%`;
    }
    return null;
  });

  constructor() {
    // Initialize chart in browser after next render
    afterNextRender(() => {
      this.initChart();
    });

    // Reactive effect to update ECharts options whenever inputs change
    effect(() => {
      const segs = this.segments();
      const tot = this.calculatedTotal();
      const sz = this.size();
      if (this.chartInstance) {
        this.updateChartOptions();
      }
    });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  private initChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const hostEl = this.chartHost()?.nativeElement;
    if (!hostEl) return;

    // Use SVG renderer for crisp scaling and test environment compatibility
    this.chartInstance = echarts.init(hostEl, null, {
      renderer: 'svg',
      width: this.size(),
      height: this.size(),
    });

    this.updateChartOptions();

    // Event listeners
    this.chartInstance.on('mouseover', 'series.pie', (params: any) => {
      const found = this.segments().find((s) => s.label === params.name);
      if (found) {
        this.hoveredSegment.set(found);
        this.segmentHover.emit(found);
      }
    });

    this.chartInstance.on('mouseout', 'series.pie', () => {
      this.hoveredSegment.set(null);
      this.segmentHover.emit(null);
    });

    this.chartInstance.on('click', 'series.pie', (params: any) => {
      const found = this.segments().find((s) => s.label === params.name);
      if (found) {
        this.segmentClick.emit(found);
      }
    });

    // Resize observer
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.chartInstance?.resize({
          width: this.size(),
          height: this.size(),
        });
      });
      this.resizeObserver.observe(hostEl);
    }
  }

  private updateChartOptions(): void {
    if (!this.chartInstance) return;

    const data = this.segments().map((s) => ({
      name: s.label,
      value: s.value,
      itemStyle: {
        color: s.color,
      },
    }));

    const option: ECOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        textStyle: {
          color: '#f8fafc',
          fontSize: 12,
          fontFamily: 'inherit',
        },
        padding: [8, 12],
        formatter: (params: any) => {
          const val = new Intl.NumberFormat().format(params.value);
          return `<strong>${params.name}</strong><br/>${val} items (${params.percent}%)`;
        },
      },
      series: [
        {
          name: 'Distribution',
          type: 'pie',
          radius: ['62%', '84%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          padAngle: 2.5,
          itemStyle: {
            borderRadius: 6,
          },
          label: {
            show: false,
          },
          emphasis: {
            scale: true,
            scaleSize: 6,
            itemStyle: {
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.35)',
            },
          },
          data,
        },
      ],
    };

    this.chartInstance.setOption(option, true);
  }

  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  }
}
