import {
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
  BehaviorSubject,
  Observable,
  map,
  tap
} from 'rxjs';

import {
  AuthApi,
  LoginRequest,
  RegisterRequest,
  UserProfile
} from '../services/auth.api';

const TOKEN_KEY = 'cryptoloan_token';
const USER_KEY = 'cryptoloan_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token$ = new BehaviorSubject<string | null>(null);
  private user$ = new BehaviorSubject<UserProfile | null>(null);

  constructor(
    private authApi: AuthApi,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token$.next(this.getToken());
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        try { this.user$.next(JSON.parse(raw)); } catch { localStorage.removeItem(USER_KEY); }
      }
      if (this.getToken()) {
        this.authApi.me().subscribe({
          next: (profile) => {
            localStorage.setItem(USER_KEY, JSON.stringify(profile));
            this.user$.next(profile);
          },
          error: () => this.logout(),
        });
      }
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  tokenChanges(): Observable<string | null> {
    return this.token$.asObservable();
  }

  userChanges(): Observable<UserProfile | null> { return this.user$.asObservable(); }
  currentUser(): UserProfile | null { return this.user$.value; }
  hasRole(role: string): boolean { return this.user$.value?.roles.includes(role) ?? false; }

  login(req: LoginRequest): Observable<void> {
    return this.authApi.login(req).pipe(
      tap((resp) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(TOKEN_KEY, resp.token);
          localStorage.setItem(USER_KEY, JSON.stringify(resp.user));
        }

        this.token$.next(resp.token);
        this.user$.next(resp.user);
      }),

      map(() => void 0)
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.authApi.register(req);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    this.token$.next(null);
    this.user$.next(null);
  }
}
