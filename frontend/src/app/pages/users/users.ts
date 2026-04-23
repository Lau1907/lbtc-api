import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  newUser = { name: '', lastname: '', username: '', password: '', role: 'user' };

  constructor(private http: HttpClient, private auth: AuthService) {}

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
    if (!this.newUser.name || !this.newUser.username || !this.newUser.password) {
      this.errorMsg = 'Todos los campos son requeridos';
      return;
    }
    this.http.post('/api/user', this.newUser).subscribe({
      next: () => {
        this.successMsg = 'Usuario creado exitosamente';
        this.newUser = { name: '', lastname: '', username: '', password: '' , role: 'user'};
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
}