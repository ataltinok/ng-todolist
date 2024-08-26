import { Component, Input, ElementRef, ViewChild } from '@angular/core';
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
  isNew = true;
  isPromoted = false;
  @Input() id!: string;
  @ViewChild('editTextArea') editTextArea!: ElementRef;

  focus() {
    setTimeout(() => {
      if (this.edit && this.editTextArea) {
        this.editTextArea.nativeElement.focus();
      }
    }, 0);
  }
}
