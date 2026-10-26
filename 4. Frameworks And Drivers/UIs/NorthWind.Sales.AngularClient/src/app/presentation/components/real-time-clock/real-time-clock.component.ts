import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  computed,
  inject,
  signal
} from '@angular/core';

const DayNames = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado'
];

const MonthNames = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre'
];

@Component({
  selector: 'app-real-time-clock',
  standalone: true,
  templateUrl: './real-time-clock.component.html',
  styleUrl: './real-time-clock.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimeClockComponent {
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  public readonly currentTime = signal<Date>(new Date());

  public readonly formattedDate = computed(() => {
    const date = this.currentTime();
    const dayName = DayNames[date.getDay()];
    const day = date.getDate();
    const monthName = MonthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} de ${monthName} de ${year}`;
  });

  public readonly formattedTime = computed(() => {
    const date = this.currentTime();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  });

  public readonly isoDateTime = computed(() => {
    const date = this.currentTime();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  });

  constructor() {
    this.startClock();
  }

  private startClock(): void {
    this.ngZone.runOutsideAngular(() => {
      let intervalId: ReturnType<typeof setInterval> | null = null;
      const now = new Date();
      const msToNextSecond = 1000 - now.getMilliseconds();

      const timeoutId = setTimeout(() => {
        this.currentTime.set(new Date());
        intervalId = setInterval(() => {
          this.currentTime.set(new Date());
        }, 1000);
      }, msToNextSecond);

      this.destroyRef.onDestroy(() => {
        clearTimeout(timeoutId);
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      });
    });
  }
}
