  import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

  @Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css'
  })
  export class RegisterComponent {
    name = '';
    lastname = '';
    username = '';
    password = '';
    confirmPassword = ''; 
    error = '';
    passwordErrors: string[] = [];
    role = 'user';

    constructor(private auth: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

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
    this.error = '';
    this.passwordErrors = this.validatePassword(this.password);

    if (this.passwordErrors.length > 0) return;

    if (this.name.trim().length < 2 || this.lastname.trim().length < 2 || this.username.trim().length < 4) {
      this.error = 'Por favor, completa los campos correctamente';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.auth.register({
      name: this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res: any) => {
        this.auth.saveTokens(res.access_token, res.refresh_token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = 'El usuario ya está registrado. Elige otro nombre de usuario.';
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor.';
        } else {
          this.error = err.error?.message || err.error?.error || 'Ocurrió un error al registrarse';
        }
        this.cdr.detectChanges(); // ← fuerza la actualización de la vista
        setTimeout(() => {
          this.error = '';
          this.cdr.detectChanges(); // ← también al limpiar
        }, 5000);
      }
    });
  }
}