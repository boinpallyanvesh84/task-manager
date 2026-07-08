import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus, TASK_STATUSES } from '../../models/task';

export interface TaskFormValue {
  title: string;
  description: string;
  status: TaskStatus;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnChanges {
  @Input() editingTask: Task | null = null;

  @Output() save = new EventEmitter<TaskFormValue>();
  @Output() cancelEdit = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  readonly statuses = TASK_STATUSES;

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    status: ['Pending' as TaskStatus, [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingTask']) {
      this.resetForm();
    }
  }

  get isEditing(): boolean {
    return this.editingTask !== null;
  }

  get titleControl() {
    return this.form.controls.title;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      title: value.title!.trim(),
      description: (value.description ?? '').trim(),
      status: value.status as TaskStatus
    });

    this.resetForm();
  }

  onCancel(): void {
    this.cancelEdit.emit();
    this.resetForm();
  }

  private resetForm(): void {
    if (this.editingTask) {
      this.form.reset({
        title: this.editingTask.title,
        description: this.editingTask.description,
        status: this.editingTask.status
      });
    } else {
      this.form.reset({
        title: '',
        description: '',
        status: 'Pending'
      });
    }
  }
}
