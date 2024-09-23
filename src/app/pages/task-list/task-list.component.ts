import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GlobalserviceService } from '../../core/service/globalservice.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InewTasks } from "../../core/models/interfaces/IUser";
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit{
  @ViewChild('modal') activeModal!:ElementRef
  @ViewChild('dropDown',{ static: false }) dropDown!:ElementRef
  @ViewChild('deleteModal',{ static: false }) deleteModal!:ElementRef
  
  isOpen = false;
  public allUser:any = [];
  public editMode:boolean = false;
  taskForm!:FormGroup;
  singleTaskId:any;
  taskName!:string
  constructor(public _api:GlobalserviceService){

  }
  ngOnInit() {
  this.getAllTask();
  // initilize Form
  this.taskForm = new FormGroup({
    assigned: new FormControl('',[Validators.required]),
    status: new FormControl('',[Validators.required]),
    date: new FormControl(''),
    priority: new FormControl('',[Validators.required]),
    driscription: new FormControl(''),
  })
  }
  // get Task
  getAllTask(){
    this._api.getTask().subscribe({next:(res)=>{
      this.allUser = res 
      console.log(res);
    },
    error:(err)=>{
          console.log(err.error.msg);
    }})
  }
    // Add Task
  addTak(){
    this.activeModal.nativeElement.classList.add('active')
  }
     // Refresh Task
  refreshTask(){
    this.getAllTask();
  }
   // Task Action
  userAction(user:InewTasks){
    user ? this.editMode = true : false
    localStorage.setItem('singleTask', JSON.stringify(user));
    this.activeModal.nativeElement.classList.add('active');
    const task:any = localStorage.getItem('singleTask')
    const editTask = JSON.parse(task);
    this.singleTaskId =  editTask.id
    this.taskForm.patchValue({
      assigned: editTask.assigned,
      status:  editTask.status,
      date:  editTask.date,
      priority:  editTask.priority,
      driscription:  editTask.driscription
    })
    
  }
  // close Modal
  closeModal(){
    this.editMode = false;
    localStorage.removeItem('singleTask');
    this.activeModal.nativeElement.classList.remove('active');
    this.taskForm.reset();
    this.deleteModal.nativeElement.classList.remove('active')
  }
  // Add New Task
  newTaskForm(){
    // Edit Task
    if(this.editMode){
      this._api.editTask(this.taskForm.value, this.singleTaskId).subscribe({next:(res:any)=>{
         console.log(res);
         localStorage.removeItem('singleTask');
         this.getAllTask();
         this.taskForm.reset();
         this.activeModal.nativeElement.classList.remove('active');
        },
       error:(err)=>{
         console.log(err.error.msg);  
       }
       })
    }
    else{
      // add Task
      const task:InewTasks =   this.taskForm.value
      this._api.addTask(task).subscribe({next:(res)=>{
        if(res){
          this.activeModal.nativeElement.classList.remove('active')
        }
        this.getAllTask();
        this.taskForm.reset();
      },
      error:(err)=>{
        console.log(err.error.msg);  
      }
    })
    }
   
  }
  // delete Task
  deleteTask(id:any, taskName:string){
    this.taskName = taskName;
    localStorage.setItem('deleteID',id)
    this.deleteModal.nativeElement.classList.add('active')

      // this._api.deleteTask(id).subscribe({
      //   next:(res)=>{
      //     this.getAllTask();
      //   },
      //   error:(err)=>{
      //     console.log(err.error.msg);
      //   }
      // })
  }

  conFirm(){
     localStorage.getItem('deleteID')
       if( localStorage.getItem('deleteID')){
      this._api.deleteTask( localStorage.getItem('deleteID')).subscribe({
        next:(res)=>{
          this.getAllTask();
          this.deleteModal.nativeElement.classList.remove('active');
          localStorage.removeItem('deleteID')
        },
        error:(err)=>{
          console.log(err.error.msg);
        }
      })
        
       }
       else{

       }

      }
  // dropDown
  // customDrop(e:Event){
  //   e.stopPropagation();
  //   this.isOpen = !this.isOpen 
  //   console.log(this.isOpen );
    
  //   if(this.isOpen){
  //     this.dropDown.nativeElement.classList.add('open')
  //   }
  //   else{
  //     this.dropDown.nativeElement.classList.remove('open')
  //   }
  // }
  // @HostListener('document:click', ['$event'])
  // handleClickOutside(event: MouseEvent) {
  //   const clickedInside = this.dropDown.nativeElement.contains(event.target);
  //   if (this.isOpen && !clickedInside) {
  //     this.isOpen = false;
  //     this.dropDown.nativeElement.classList.remove('open');
  //   }
  // }
}
