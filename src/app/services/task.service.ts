import { Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from '../models/task';

const STORAGE_KEY = 'task-manager.tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasksSignal = signal<Task[]>(this.readFromStorage());

  readonly tasks = this.tasksSignal.asReadonly();

  addTask(title: string, description: string, status: TaskStatus): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.generateId(),
      title: title.trim(),
      description: description.trim(),
      status,
      createdAt: now,
      updatedAt: now
    };

    this.tasksSignal.update((tasks) => [task, ...tasks]);
    this.persist();
    return task;
  }

  updateTask(id: string, changes: Pick<Task, 'title' | 'description' | 'status'>): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: changes.title.trim(),
              description: changes.description.trim(),
              status: changes.status,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
    this.persist();
  }

  deleteTask(id: string): void {
    this.tasksSignal.update((tasks) => tasks.filter((task) => task.id !== id));
    this.persist();
  }

  getTaskById(id: string): Task | undefined {
    return this.tasksSignal().find((task) => task.id === id);
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  private readFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
