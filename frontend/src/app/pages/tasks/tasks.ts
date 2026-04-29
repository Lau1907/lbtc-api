import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  errorMsg = '';
  successMsg = '';

  constructor(private taskService: TaskService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();
    this.loadTasks();
  }

loadTasks() {
  this.taskService.getTasks().subscribe((data: any) => {
    console.log('DATA:', data);
    this.tasks = data;
  });
}

addTask() {
  this.errorMsg = '';
  this.title = this.title.trim();
  this.description = this.description.trim();

  if (!this.title) {
    this.errorMsg = 'El título es requerido';
    return;
  }
  if (this.title.length < 3) {
    this.errorMsg = 'El título debe tener al menos 3 caracteres';
    return;
  }
  if (this.title.length > 100) {
    this.errorMsg = 'El título no puede tener más de 100 caracteres';
    return;
  }

  // Sanitización XSS
  this.title = this.title.replace(/<[^>]*>/g, '');
  this.description = this.description.replace(/<[^>]*>/g, '');

  this.taskService.createTask({
    name: this.title,
    description: this.description,
    priority: this.priority
  }).subscribe({
    next: () => {
      this.successMsg = 'Tarea creada exitosamente ';
      this.title = '';
      this.description = '';
      this.priority = false;
      this.loadTasks();
      setTimeout(() => this.successMsg = '', 3000);
    },
    error: () => {
      this.errorMsg = 'Error al crear la tarea';
    }
  });
}

deleteTask(id: number) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

  this.taskService.deleteTask(id).subscribe({
    next: () => {
      this.successMsg = 'Tarea eliminada';

      this.tasks = this.tasks.filter(task => task.id !== id);

      this.loadTasks();

      setTimeout(() => this.successMsg = '', 3000);
    },
    error: () => {
      this.errorMsg = 'Error al eliminar la tarea';
    }
  });
}
  startEdit(task: any) {
    this.editingTask = { ...task };
  }

  saveEdit() {
  this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
    next: () => {
      this.successMsg = 'Tarea actualizada';
      this.editingTask = null;
      this.loadTasks();
      setTimeout(() => this.successMsg = '', 3000);
    },
    error: () => {
      this.errorMsg = 'Error al actualizar la tarea';
    }
  });
}

  cancelEdit() {
    this.editingTask = null;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}