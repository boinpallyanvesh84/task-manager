import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task';
import { TaskItemComponent } from '../task-item/task-item.component';

type ColumnIcon = 'todo' | 'progress' | 'done';

interface Column {
  status: TaskStatus;
  label: string;
  icon: ColumnIcon;
  colorClass: string;
  tasks: Task[];
}

const COLUMN_META: { status: TaskStatus; label: string; icon: ColumnIcon; colorClass: string }[] = [
  { status: 'Pending', label: 'To do', icon: 'todo', colorClass: 'column--pending' },
  { status: 'In Progress', label: 'In progress', icon: 'progress', colorClass: 'column--in-progress' },
  { status: 'Completed', label: 'Done', icon: 'done', colorClass: 'column--completed' }
];

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  get columns(): Column[] {
    return COLUMN_META.map((meta) => ({
      ...meta,
      tasks: this.tasks.filter((task) => task.status === meta.status)
    }));
  }

  trackByTaskId(_index: number, task: Task): string {
    return task.id;
  }
}
