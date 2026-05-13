import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private taskService: TaskService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.isAdmin = this.auth.isAdmin();

    if (this.auth.getToken()) {
      this.loadTasks();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: any) => {
        this.tasks = data;
        this.cdr.detectChanges();
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

  addTask() {
    const titleTrimmed = this.title.trim();
    if (!titleTrimmed) return this.showError('El título es requerido');

    this.taskService.createTask({
      name: titleTrimmed,
      description: this.description.trim(),
      priority: this.priority
    }).subscribe({
      next: (newTask: any) => {
        this.tasks = [...this.tasks, newTask];
        this.resetForm();
        this.showSuccess('¡Tarea creada exitosamente!');
      },
      error: () => this.showError('Error al crear la tarea')
    });
  }

  deleteTask(id: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.showSuccess('¡Tarea eliminada exitosamente!');
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
        this.showSuccess('¡Tarea actualizada exitosamente!');
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