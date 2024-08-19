import { Component, Input, Output, EventEmitter } from '@angular/core';
import { timeoutProvider } from 'rxjs/internal/scheduler/timeoutProvider';
import { TaskStates } from '../task-states';

@Component({
  selector: 'task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  state = TaskStates.idle;
  text = "test";
  @Input() id = 0;
  @Output() toInProgressEvent = new EventEmitter<number>();
  @Output() toCompleteEvent = new EventEmitter<number>();

  updateTask() {
    if (this.state === TaskStates.idle) {
      this.state = TaskStates.inProgress;
      this.toInProgressEvent.emit(this.id);
    } else if (this.state === TaskStates.inProgress) {
      this.state = TaskStates.completed;
      this.toCompleteEvent.emit(this.id);
    }
  }
}
