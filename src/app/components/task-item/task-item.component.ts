import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task';

const AVATAR_COLORS = ['#3b6fe0', '#e07a3b', '#3ba86a', '#a13be0', '#e03b6f', '#3bb9e0'];

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    const confirmed = confirm(`Delete "${this.task.title}"? This cannot be undone.`);
    if (confirmed) {
      this.delete.emit(this.task.id);
    }
  }

  get avatarInitial(): string {
    return this.task.title.trim().charAt(0).toUpperCase() || '?';
  }

  get avatarColor(): string {
    const sum = this.task.title
      .split('')
      .reduce((total, char) => total + char.charCodeAt(0), 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  }
}
