import { TaskService } from "./task.service";
export declare class TaskController {
    private readonly taskSvc;
    constructor(taskSvc: TaskService);
    getTasks(req: any): Promise<any>;
    getTaskById(id: number): Promise<any>;
    insertTask(task: any): Promise<any>;
    deleteTask(id: number, req: any): Promise<boolean>;
    updateTask(id: number, task: any, req: any): Promise<any>;
}
