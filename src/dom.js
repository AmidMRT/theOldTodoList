import { controlLogic, makeProject, makeTask } from "./app";
import "./styles.css";

let projectList = [];
const control = controlLogic(); //cache first active project (which is null)

let addProject = document.querySelector("#addProj");
addProject.addEventListener("click", () => addNewProject());

//show tasks and render task button after choosing project
document.addEventListener("click", (e) => {
  if (e.target.matches(".project")) {   
    projectList.forEach((item) => {                         //search for the seleceted project in the project list 
      if (item.getName() == e.target.textContent) {
        control.updateActiveProject(item);
        document.querySelector(".desktop").innerHTML = "";  //clear task space to render a new list
        makeTaskBtn();
        showTaks();
      }
    });
  }
});

//add new task
document.addEventListener("click", (e) => {
  if (e.target.matches(".addTask")) {
    addNewTask();
  }
});

function addNewProject() {
  const newProject = makeProject(prompt("tell me the proj name"));
  projectList.push(newProject);
  const projectBar = document.querySelector(".leftBar");
  let newBtn = document.createElement("button");
  newBtn.className = "project";
  newBtn.textContent = newProject.getName();
  projectBar.insertBefore(newBtn, projectBar.querySelector("#addProj"));
}

function makeTaskBtn() {
  let taskBtn = document.createElement("button");
  taskBtn.className = "addTask";
  taskBtn.textContent = "+ Add Task";
  document.querySelector(".desktop").appendChild(taskBtn);
}

function showTaks() {
  control
    .getActiveProject()
    .getTasks()
    .forEach((taskItem) => {
      let task = document.createElement("div");
      task.textContent = taskItem.getTtl();
      document.querySelector(".desktop").appendChild(task);
    });
}

function addNewTask() {
  let activeProject = control.getActiveProject();
  let newTask = makeTask(prompt("ttl"), prompt("des"));
  activeProject.addTask(newTask);
  let taskDiv = document.createElement("div");
  taskDiv.className = "task"
  taskDiv.textContent = newTask.getTtl();
  let workspace = document.querySelector(".desktop")
  workspace.insertBefore(taskDiv, workspace.querySelector(".addTask"));
}