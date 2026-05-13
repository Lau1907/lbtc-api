import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();

    if (this.auth.getToken()) {
      this.loadUsers();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadUsers() {
    this.http.get<any[]>('/api/user').subscribe({
      next: (data) => {
        this.users = data;
        this.errorMsg = '';
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        } else {
          this.showError('Error al cargar usuarios');
        }
      }
    });
  }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = '';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  private showError(msg: string) {
    this.errorMsg = msg;
    this.successMsg = '';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.errorMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  createUser() {
    if (!this.newUser.name || this.newUser.name.trim().length < 2)
      return this.showError('El nombre debe tener al menos 2 caracteres');
    if (!this.newUser.lastname || this.newUser.lastname.trim().length < 2)
      return this.showError('El apellido debe tener al menos 2 caracteres');
    if (!this.newUser.username || this.newUser.username.trim().length < 4)
      return this.showError('El usuario debe tener al menos 4 caracteres');
    if (!this.newUser.password)
      return this.showError('La contraseña es requerida');

    this.passwordErrors = this.validatePassword(this.newUser.password);
    if (this.passwordErrors.length > 0)
      return this.showError('La contraseña no cumple los requisitos');

    this.http.post('/api/user', this.newUser).subscribe({
      next: () => {
        this.newUser = { name: '', lastname: '', username: '', password: '', role: 'user' };
        this.showForm = false;
        this.loadUsers();
        this.showSuccess('!Usuario creado exitosamente!');
      },
      error: () => this.showError('Error al crear el usuario')
    });
  }

  startEdit(user: any) {
    this.editingUser = { ...user, password: '' };
  }

  saveEdit() {
    if (this.editingUser.password) {
      this.editPasswordErrors = this.validatePassword(this.editingUser.password);
      if (this.editPasswordErrors.length > 0)
        return this.showError('La contraseña no cumple los requisitos');
    }

    this.http.put(`/api/user/${this.editingUser.id}`, this.editingUser).subscribe({
      next: () => {
        this.editingUser = null;
        this.loadUsers();
        this.showSuccess('!Usuario actualizado!');
      },
      error: () => this.showError('Error al actualizar el usuario')
    });
  }

  cancelEdit() {
    this.editingUser = null;
  }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.http.delete(`/api/user/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.showSuccess('!Usuario eliminado!');
      },
      error: () => this.showError('Error al eliminar el usuario')
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