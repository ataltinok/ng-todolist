import { Component, Input, Output } from '@angular/core';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  
  @Input() header = "";
  tasks : any[] = this.loadTasks();

  loadTasks(): TaskComponent[] {
    console.log("loading");
    let result = JSON.parse(localStorage.getItem(this.header + "Tasks") ?? '[]');
    console.log(typeof localStorage);
    return result;
  }

  addTask(): void {
    let task = new TaskComponent();
    this.tasks.push(task);
    localStorage.setItem(this.header + 'Tasks', JSON.stringify(this.tasks))
    console.log(JSON.parse(localStorage.getItem(this.header + 'Tasks') ?? '[]'));
  }

  deleteTask(task: TaskComponent): void {
    this.tasks.splice(this.tasks.indexOf(task), 1)
  }
  
}
