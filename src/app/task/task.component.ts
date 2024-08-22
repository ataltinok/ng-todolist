import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskStates } from '../task-states';

@Component({
  selector: 'task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  text = "New task";
  edit = false;
  @Input() id!: string;
}
