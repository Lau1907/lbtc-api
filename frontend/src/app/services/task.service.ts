import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = '/api/task';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      })
    };
  }

  getTasks() {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

createTask(task: { name: string; description?: string; priority?: boolean; user_id?: number }) {
  return this.http.post<any>(this.apiUrl, task, this.getHeaders());
}

  updateTask(id: number, task: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, task, this.getHeaders());
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}