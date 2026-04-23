import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guards";
import { TaskService } from "./task.service";
@Controller("/api/task")
export class TaskController{

    constructor(private  readonly taskSvc: TaskService){}

    @Get()
    @ApiOperation({summary: 'Lista de tareas disponibles'})
    @UseGuards(AuthGuard)
    public async getTasks(@Req() req: any): Promise<any>{
        const userId = req['user'].sub;
        return await this.taskSvc.getTasksByUser(userId);
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