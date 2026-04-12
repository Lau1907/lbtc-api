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

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.auth.register({
      name: this.name,
      lastname: this.lastname,
      username: this.username,
      password: this.password
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