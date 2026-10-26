import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { AuthService } from '../../../../infrastructure/auth/auth.service';
import { Router } from '@angular/router';

describe('LogoutComponent', () => {
  let fixture: ComponentFixture<LogoutComponent>;
  let mockAuthService: { logout: ReturnType<typeof vi.fn> };
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockAuthService = {
      logout: vi.fn()
    };
    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LogoutComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    fixture.detectChanges();
  });

  it('should call authService.logout and navigate to / on initialization', () => {
    expect(mockAuthService.logout).toHaveBeenCalledWith(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
