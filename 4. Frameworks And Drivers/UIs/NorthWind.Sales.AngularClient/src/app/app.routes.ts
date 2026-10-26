import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';
import { MainLayoutComponent } from './presentation/layout/main-layout/main-layout.component';
import { HomeComponent } from './presentation/pages/home/home.component';
import { CreateOrderComponent } from './presentation/pages/create-order/create-order.component';
import { InvoiceSearchComponent } from './presentation/pages/invoices/invoice-search/invoice-search.component';
import { InvoiceDetailComponent } from './presentation/pages/invoices/invoice-detail/invoice-detail.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { RegisterComponent } from './presentation/pages/auth/register/register.component';
import { LogoutComponent } from './presentation/pages/auth/logout/logout.component';
import { NotFoundComponent } from './presentation/pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'createorder',
        component: CreateOrderComponent,
        canActivate: [authGuard]
      },
      {
        path: 'invoices',
        component: InvoiceSearchComponent,
        canActivate: [authGuard]
      },
      {
        path: 'invoices/:id',
        component: InvoiceDetailComponent,
        canActivate: [authGuard]
      },
      {
        path: 'user/login',
        component: LoginComponent
      },
      {
        path: 'user/register',
        component: RegisterComponent
      },
      {
        path: 'user/logout',
        component: LogoutComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];
