import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { TaskService } from "./task.service";
@Controller("/api/task")
export class TaskController{

    constructor(private  readonly taskSvc: TaskService){}

    @Get()
    @ApiOperation({summary: 'Lista de tareas disponibles'})
    public async getTasks(): Promise<any>{
        return await this.taskSvc.getTasks();
    }

    @Get(":id")
    public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<any> {
        var task = await this.taskSvc.getTaskById(id);

        if (task) return task;
        else throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    @Post()
    public async insertTask(@Body() task: any): Promise<any> {
        return await this.taskSvc.insertTask(task);
    }

    @Put(":id")
    public updateTask(@Param("id", ParseIntPipe) id:number, @Body() task: any):any{
        return this.taskSvc.updateTask((id), task);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<boolean> {

        const result = await this.taskSvc.deleteTask(id);

        if (!result)
            throw new HttpException('No se pudo eliminar la tarea', HttpStatus.INTERNAL_SERVER_ERROR);

        return result;
    }

}