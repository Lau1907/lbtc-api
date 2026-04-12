import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data;
    });
  }

  addTask() {
  if (!this.title.trim()) return;
  this.taskService.createTask({ 
    name: this.title,
    description: this.description,
    priority: this.priority, // 👈 usa la variable
    user_id: 1
  }).subscribe(() => {
    this.title = '';
    this.description = '';
    this.priority = false;
    this.loadTasks();
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