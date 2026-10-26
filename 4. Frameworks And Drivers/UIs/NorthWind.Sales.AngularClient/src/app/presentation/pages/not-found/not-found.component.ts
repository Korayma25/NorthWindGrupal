import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5 text-center">
      <h2 class="fw-bold mb-3">404</h2>
      <p class="text-muted mb-4">Página no encontrada.</p>
      <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
    </div>
  `
})
export class NotFoundComponent {}
