import { Injectable, output } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskComponent } from './task/task.component';

@Injectable({
  providedIn: 'root'
})
export class TaskUpdaterService {
  private updatedTaskSource = new Subject<{updatedTask: TaskComponent, newHeader: string}>();
  
  updatedTask$ = this.updatedTaskSource.asObservable();

  promoteTask(updatedTask: TaskComponent, newHeader: string): void {
    this.updatedTaskSource.next({updatedTask, newHeader});
  }  

  demoteTask(updatedTask: TaskComponent, newHeader: string): void {
    this.updatedTaskSource.next({updatedTask, newHeader});
  }  
}
