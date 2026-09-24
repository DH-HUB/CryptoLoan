import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  mode: 'login' | 'register' = 'login';

  error: string | null = null;

  loading = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  switchMode(m: 'login' | 'register') {
    this.mode = m;
    this.error = null;
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const value = this.loginForm.getRawValue();

    this.auth
      .login({
        email: value.email!,
        password: value.password!,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl('/');
        },

        error: (e) => {
          this.loading = false;
          this.error =
            e?.error?.message || 'Identifiants invalides.';
        },
      });
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const v = this.registerForm.getRawValue();

    this.auth
      .register({
        name: v.name!,
        email: v.email!,
        password: v.password!,
      })
      .subscribe({
        next: () => {
          this.loading = false;

          this.switchMode('login');
        },

        error: (e) => {
          this.loading = false;
          this.error =
            e?.error?.message ||
            'Impossible de créer le compte.';
        },
      });
  }
}
