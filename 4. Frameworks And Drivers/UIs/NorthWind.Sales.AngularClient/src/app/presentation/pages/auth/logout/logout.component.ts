import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `
    <div class="container-fluid py-4">
      <!-- Logout processing -->
    </div>
  `
})
export class LogoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.authService.logout(false);
    void this.router.navigate(['/']);
  }
}
