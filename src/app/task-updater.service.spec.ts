import { TestBed } from '@angular/core/testing';

import { TaskUpdaterService } from './task-updater.service';

describe('TaskUpdaterService', () => {
  let service: TaskUpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskUpdaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
