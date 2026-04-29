import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  editingUser: any = null;
  showForm = false;
  currentUser: any = null;
  isAdmin = false;
  errorMsg = '';
  successMsg = '';
  password = '';
  passwordErrors: string[] = [];
  editPasswordErrors: string[] = [];

  newUser = { name: '', lastname: '', username: '', password: '', role: 'user' };

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('/api/user').subscribe({
      next: (data) => this.users = data,
      error: () => this.errorMsg = 'Error al cargar usuarios'
    });
  }

  createUser() {
    this.errorMsg = '';

    if (!this.newUser.name || this.newUser.name.trim().length < 2) {
      this.errorMsg = 'El nombre debe tener al menos 2 caracteres';
      return;
    }
    if (!this.newUser.lastname || this.newUser.lastname.trim().length < 2) {
      this.errorMsg = 'El apellido debe tener al menos 2 caracteres';
      return;
    }
    if (!this.newUser.username || this.newUser.username.trim().length < 4) {
      this.errorMsg = 'El usuario debe tener al menos 4 caracteres';
      return;
    }
    if (!this.newUser.password) {
      this.errorMsg = 'La contraseña es requerida';
      return;
    }

    this.passwordErrors = this.validatePassword(this.newUser.password);
    if (this.passwordErrors.length > 0) {
      this.errorMsg = 'La contraseña no cumple los requisitos';
      return;
    }

    this.http.post('/api/user', this.newUser).subscribe({
      next: () => {
        this.successMsg = 'Usuario creado exitosamente ';
        this.newUser = { name: '', lastname: '', username: '', password: '', role: 'user' };
        this.showForm = false;
        this.loadUsers();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.errorMsg = 'Error al crear el usuario'
    });
  }

  startEdit(user: any) {
    this.editingUser = { ...user, password: '' };
  }

saveEdit() {
  this.errorMsg = '';

  if (this.editingUser.password) {
    this.editPasswordErrors = this.validatePassword(this.editingUser.password);

    if (this.editPasswordErrors.length > 0) {
      this.errorMsg = 'La contraseña no cumple los requisitos';
      return;
    }
  }

this.http.put(`/api/user/${this.editingUser.id}`, this.editingUser).subscribe({
  next: () => {
    this.successMsg = 'Usuario actualizado';
    this.editingUser = null;
    this.loadUsers();
    setTimeout(() => this.successMsg = '', 3000);
  },
  error: () => this.errorMsg = 'Error al actualizar el usuario'
});
  }

  cancelEdit() { this.editingUser = null; }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.http.delete(`/api/user/${id}`).subscribe({
      next: () => {
        this.successMsg = 'Usuario eliminado';
        this.loadUsers();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.errorMsg = 'Error al eliminar el usuario'
    });
  }

  validatePassword(password: string): string[] {
  const errors = [];
  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un número');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Al menos un carácter especial (!@#$%^&*)');
  return errors;
}
onEditPasswordChange() {
  this.editPasswordErrors = this.validatePassword(this.editingUser.password || '');
}

onPasswordChange() {
  this.passwordErrors = this.validatePassword(this.newUser.password);
}
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}