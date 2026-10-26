import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service';
import { es } from '../../../i18n/es';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public readonly authService = inject(AuthService);
  public readonly es = es;
}
