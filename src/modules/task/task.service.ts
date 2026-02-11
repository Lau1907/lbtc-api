import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./create-task-dto";

@Injectable()
export class TaskService {

    private tasks: any[] = []

    public getTasks (){
        return this.tasks;
    }
    
    public getTaskById(id: number):string{
        var task = this.tasks.find((data) => data.id == id)
        return task;
    }
    public insertTask(task: CreateTaskDto): any {
        var id = this.tasks.length + 1;
        var position = this.tasks.push({
            ...task,
            id
        });
        //task.id = id
        return this.tasks[position - 1];
    }

    public updateTask(id: number, task: any): any {
        const taskUpdate = this.tasks.map( (data) => {
            console.error("id", id);
            console.error("data", data);
            if (data.id == id){

            console.error("task", task);
            console.error("STORE", data);

                if (task.name) data.name = task.name;
                if (task.description) data.description = task.description;
                if (task.priority != null) data.priority = task.priority;

            console.error("task", task.priority);
            console.error("STORE", data);
                return data
            }
            return data
        })
        return taskUpdate;
    }

    public deleteTask(id: number): string {
        const array = this.tasks.filter( data => data.id);
        this.tasks = array;

        return `Task Delete`;
    }

}