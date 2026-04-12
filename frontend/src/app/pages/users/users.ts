import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  newUser = { name: '', lastname: '', username: '', password: '' };

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    };
  }

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.http.get<any[]>('/api/user', this.getHeaders()).subscribe(data => {
      this.users = data;
    });
  }

  createUser() {
    this.http.post('/api/user', this.newUser, this.getHeaders()).subscribe(() => {
      this.newUser = { name: '', lastname: '', username: '', password: '' };
      this.showForm = false;
      this.loadUsers();
    });
  }

  startEdit(user: any) {
    this.editingUser = { ...user, password: '' };
  }

  saveEdit() {
    this.http.put(`/api/user/${this.editingUser.id}`, this.editingUser, this.getHeaders()).subscribe(() => {
      this.editingUser = null;
      this.loadUsers();
    });
  }

  cancelEdit() { this.editingUser = null; }

  deleteUser(id: number) {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.http.delete(`/api/user/${id}`, this.getHeaders()).subscribe(() => {
      this.loadUsers();
    });
  }
}