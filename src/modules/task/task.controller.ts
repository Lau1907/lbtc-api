import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
@Controller("api/task")
export class TaskController{

    constructor(private  readonly taskSvc: TaskService){}

    @Get()
    public getTasks(): any{
        return this.taskSvc.getTasks();
    }

    @Get(":id")
    public getTaskById(@Param("id", ParseIntPipe) id: number): any {
        var task = this.taskSvc.getTaskById(id)
        return this.taskSvc.getTaskById((id));
        if (task) return task;
        else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    @Post()
    public insertTask(@Body() task: any): any {
        return this.taskSvc.insertTask(task);
    }

    @Put(":id")
    public updateTask(@Param("id", ParseIntPipe) id:number, @Body() task: any):any{
        return this.taskSvc.updateTask((id), task);
    }

    @Delete(":id")
    public deleteTask(@Param("id", ParseIntPipe) id: number) {
        return this.taskSvc.deleteTask((id));
    }

}