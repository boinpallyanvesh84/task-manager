import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './models/task';
import { TaskService } from './services/task.service';
import { TaskFormComponent, TaskFormValue } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly taskService = inject(TaskService);

  readonly searchTerm = signal('');
  readonly isModalOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);

  readonly filteredTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const all = this.taskService.tasks();
    if (!term) {
      return all;
    }
    return all.filter(
      (task) =>
        task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term)
    );
  });

  readonly hasAnyTasks = computed(() => this.taskService.tasks().length > 0);

  openAddModal(): void {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingTask.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  onSave(value: TaskFormValue): void {
    const editing = this.editingTask();
    if (editing) {
      this.taskService.updateTask(editing.id, value);
    } else {
      this.taskService.addTask(value.title, value.description, value.status);
    }
    this.closeModal();
  }

  onDeleteRequested(id: string): void {
    this.taskService.deleteTask(id);
  }
}
