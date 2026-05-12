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
  currentUser: any = null;
  isAdmin = false;
  errorMsg = '';
  successMsg = '';

  constructor(private taskService: TaskService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Verificamos identidad primero
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();

    if (this.auth.getToken()) {
      this.loadTasks(); // Llamada inmediata
    } else {
      this.router.navigate(['/']);
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => {
        // Asegúrate de que 'data' sea el arreglo. 
        // Si el backend devuelve algo como { data: [...] }, usa data.data
        this.tasks = data; 
      },
      error: (err) => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        } else {
          this.showError('Error al cargar tareas');
        }
      }
    });
  }

  private showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = ''; // Limpiamos errores previos
    setTimeout(() => this.successMsg = '', 3000);
  }

  private showError(msg: string) {
    this.errorMsg = msg;
    this.successMsg = ''; // Limpiamos mensajes de éxito previos
    setTimeout(() => this.errorMsg = '', 3000);
  }

  addTask() {
    const titleTrimmed = this.title.trim();
    if (!titleTrimmed) return this.showError('El título es requerido');

    this.taskService.createTask({
      name: titleTrimmed,
      description: this.description.trim(),
      priority: this.priority
    }).subscribe({
      next: (newTask: any) => {
        // Opción A: Agregar al array (más rápido)
        this.tasks = [...this.tasks, newTask];
        // Opción B: Recargar del servidor para asegurar orden
        // this.loadTasks(); 
        
        this.resetForm();
        this.showSuccess('Tarea creada exitosamente ');
      },
      error: () => this.showError('Error al crear la tarea')
    });
  }

  deleteTask(id: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // Filtramos localmente para que desaparezca de inmediato
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.showSuccess('Tarea eliminada ');
      },
      error: () => this.showError('Error al eliminar la tarea')
    });
  }

  private resetForm() {
    this.title = '';
    this.description = '';
    this.priority = false;
  }


  startEdit(task: any) {
    this.editingTask = { ...task };
  }

  saveEdit() {
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
      next: (updatedTask: any) => {
        this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        this.editingTask = null;
        this.showSuccess('Tarea actualizada');
      },
      error: () => this.showError('Error al actualizar la tarea')
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