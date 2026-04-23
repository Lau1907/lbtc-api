import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  name = '';
  lastname = '';
  username = '';
  password = '';
  error = '';
  passwordErrors: string[] = [];
  role = 'user';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  validatePassword(password: string): string[] {
    const errors = [];
    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
    if (!/[0-9]/.test(password)) errors.push('Al menos un número');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Al menos un carácter especial (!@#$%^&*)');
    return errors;
  }

  onPasswordChange() {
    this.passwordErrors = this.validatePassword(this.password);
  }

  register() {
  // Validar contraseña antes de enviar
  this.passwordErrors = this.validatePassword(this.password);
  if (this.passwordErrors.length > 0) return; // 👈 detiene si hay errores

  this.error = '';

  if (!this.name || !this.lastname || !this.username || !this.password) {
    this.error = 'Todos los campos son requeridos';
    return;
  }

  this.auth.register({
    name: this.name,
    lastname: this.lastname,
    username: this.username,
    password: this.password,
    role: this.role
  }).subscribe({
    next: (res) => {
      this.auth.saveTokens(res.access_token, res.refresh_token);
      this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.error = 'Error al registrarse, intenta de nuevo';
    }
  });
}
}