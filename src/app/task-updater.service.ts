import { Injectable, output } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskComponent } from './task/task.component';

@Injectable({
  providedIn: 'root'
})
export class TaskUpdaterService {
  private promotedTaskSource = new Subject<{promotedTask: TaskComponent, newHeader: string}>();
  
  promotedTask$ = this.promotedTaskSource.asObservable();

  promoteTask(promotedTask: TaskComponent, newHeader: string): void {
    this.promotedTaskSource.next({promotedTask, newHeader});
  }  
}
