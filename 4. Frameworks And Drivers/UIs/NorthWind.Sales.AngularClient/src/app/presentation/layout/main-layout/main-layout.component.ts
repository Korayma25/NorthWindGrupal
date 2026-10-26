import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { RealTimeClockComponent } from '../../components/real-time-clock/real-time-clock.component';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RealTimeClockComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  public readonly authService = inject(AuthService);
  public readonly es = es;

  public readonly collapseNavMenu = signal<boolean>(true);

  public toggleNavMenu(): void {
    this.collapseNavMenu.update(c => !c);
  }

  public collapseNavMenuOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 641) {
      this.collapseNavMenu.set(true);
    }
  }
}
