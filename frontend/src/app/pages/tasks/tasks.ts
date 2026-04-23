import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {

  tasks: any[] = [];
  title = '';
  description = '';
  priority = false;
  editingTask: any = null;
  currentUser: any=null;
  isAdmin = false;

  constructor(private taskService: TaskService, private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data;
    });
  }

  addTask() {
  this.title = this.title.trim();
  this.description = this.description.trim();

  if (!this.title) return;
  if (this.title.length > 100) {
    alert('El título no puede tener más de 100 caracteres');
    return;
  }

  // Prevenir XSS — eliminar tags HTML
  this.title = this.title.replace(/<[^>]*>/g, '');
  this.description = this.description.replace(/<[^>]*>/g, '');

  this.taskService.createTask({
    name: this.title,
    description: this.description,
    priority: this.priority,
    user_id: 1
  }).subscribe({
    next: () => {
      this.title = '';
      this.description = '';
      this.priority = false;
      this.loadTasks();
    },
    error: () => alert('Error al crear la tarea')
  });
}
  deleteTask(id: number) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
  this.taskService.deleteTask(id).subscribe(() => {
    this.loadTasks();
  });
}

  startEdit(task: any) {
    this.editingTask = { ...task };
  }

  saveEdit() {
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe(() => {
      this.editingTask = null;
      this.loadTasks();
    });
  }

  cancelEdit() {
    this.editingTask = null;
  }
}