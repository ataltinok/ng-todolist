import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { TaskStates } from '../task-states';
import { TaskUpdaterService } from '../task-updater.service';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [TaskComponent, NgFor],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  
  @Input() header: string = "";
  tasks : TaskComponent[] = [];

  constructor(private taskUpdaterService: TaskUpdaterService) {}

  ngOnInit(): void {
    let result = this.getTasks(this.header);
    this.loadTasks(result);

    this.taskUpdaterService.updatedTask$.subscribe(({updatedTask, newHeader}) => {
      if (newHeader === this.header) {
        this.addTask(this.header, updatedTask)
      }
    });
  }
  
  getTasks(header: String): TaskComponent[] {
    return JSON.parse(localStorage.getItem(header + "Tasks") ?? '[]');
  }

  loadTasks(tasks: TaskComponent[]): void {
    this.tasks = tasks
  }

  addTask(header: string, task?: TaskComponent): void {
    // Prepare task
    let taskCount = Number(JSON.parse(localStorage.getItem("taskCount") ?? '0'));
    task = task ?? new TaskComponent();
    task.id = String(Number(taskCount) + 1);
    
    // Add new task at the top
    this.tasks.splice(0, 0, task);
    setTimeout(() => task.isNew = false, 500);

    // Update the stored tasks
    localStorage.setItem(header + 'Tasks', JSON.stringify(this.tasks))
    localStorage.setItem("taskCount", JSON.stringify(task.id));
  }

  deleteTask(task: TaskComponent): void {
    // Delete the item from the current task list
    this.tasks.splice(this.tasks.indexOf(task), 1)

    // Update local storage
    localStorage.setItem(this.header + 'Tasks', JSON.stringify(this.tasks))

    // Find total number of tasks in all task lists
    let totalTaskCount = 0;
    Object.keys(TaskStates).forEach((header) => {
      if (isNaN(Number(header))) {
        totalTaskCount += this.getTasks(header).length;
      }
    });

    // Reset the local storage just in case
    if (totalTaskCount === 0) {
      localStorage.setItem("taskCount", JSON.stringify(0));
      localStorage.setItem("IdleTasks", JSON.stringify([]));
      localStorage.setItem("StartedTasks", JSON.stringify([]));
      localStorage.setItem("CompletedTasks", JSON.stringify([]));
    }
  }

  promoteTask(task: TaskComponent) {
    this.deleteTask(task);
    let newHeader = "";
    if (this.header === "Idle") {
      newHeader = "Started"
    } else if (this.header === "Started") {
      newHeader = "Completed";
    } else {
      return;
    }
    this.taskUpdaterService.promoteTask(task, newHeader);
    setTimeout(() => this.tasks = this.tasks.filter(t => t !== task), 300);
  }

  demoteTask(task: TaskComponent) {
    this.deleteTask(task);
    let newHeader = "";
    if (this.header === "Started") {
      newHeader = "Idle"
    } else if (this.header === "Completed") {
      newHeader = "Started";
    } else {
      return;
    }
    this.taskUpdaterService.demoteTask(task, newHeader);
  }

  toggleEdit(task: TaskComponent) {
    task.edit = !task.edit;

    // This is probably bad practice but I don't care, it works.
    setTimeout(() => {
      const textAreaElement = <HTMLTextAreaElement> document.getElementById(task.id);
      textAreaElement.focus()
      textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length); 
    }, 50)
  }

  confirmEdit(header: string, task: TaskComponent) {
    // Access DOM directly here because it is definitely loaded when I press it.
    const textAreaElement = <HTMLTextAreaElement> document.getElementById(task.id);
    this.toggleEdit(task);
    task.text = textAreaElement.value === "" ? task.text : textAreaElement.value;
    
    // Update the local storage
    this.tasks.splice(this.tasks.indexOf(task), 1, task)
    localStorage.setItem(header + 'Tasks', JSON.stringify(this.tasks))
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set to the scroll height
  }
}
