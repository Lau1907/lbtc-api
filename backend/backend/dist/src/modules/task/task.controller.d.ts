import { TaskService } from "./task.service";
export declare class TaskController {
    private readonly taskSvc;
    constructor(taskSvc: TaskService);
    getTasks(req: any): Promise<any>;
    getTaskById(id: number): Promise<any>;
    insertTask(task: any): Promise<any>;
    updateTask(id: number, task: any): any;
    deleteTask(id: number): Promise<boolean>;
}
