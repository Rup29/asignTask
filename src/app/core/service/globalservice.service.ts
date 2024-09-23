import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIConstant } from '../constant/APIConstant';
import { environment } from '../../../environments/environment';
import { InewTasks } from '../models/interfaces/IUser';
@Injectable({
  providedIn: 'root'
})
export class GlobalserviceService {

  constructor(private _api:HttpClient) { 

  }
 // get Task
 getTask(id?:number){
  if(id){
    return this._api.get(environment.api+APIConstant.list.tasklist+`/${id}`)
  }
  else{
    return this._api.get(environment.api+APIConstant.list.tasklist)
  }
 }

  // Add New Task
 addTask(data: InewTasks){
   return this._api.post(environment.api+APIConstant.list.tasklist,data)
 }
   // Edit Task
   editTask(data:InewTasks, id: number){
    console.log(data);
    
    return this._api.put(environment.api+APIConstant.list.tasklist+`/${id}`,data)
  }
    // Delete Task
 deleteTask(id: any){
  return this._api.delete(environment.api+APIConstant.list.tasklist+`/${id}`)
}
}
