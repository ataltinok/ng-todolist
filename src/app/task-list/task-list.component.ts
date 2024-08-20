import { Component, Input } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { TaskStates } from '../task-states';
import { TaskUpdaterService } from '../task-updater.service';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [TaskComponent],
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

    this.taskUpdaterService.promotedTask$.subscribe(({promotedTask, newHeader}) => {
      if (newHeader === this.header) {
        this.addTask(this.header, promotedTask)
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
    let taskCount = Number(JSON.parse(localStorage.getItem("taskCount") ?? '0'));
    task = task ?? new TaskComponent();
    task.id = taskCount + 1;
    
    this.tasks.push(task);
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
  }

  editTask(task: TaskComponent) {
    
  }
  
}
