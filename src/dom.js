import { controlLogic, makeProject, makeTask } from "./app";
import "./styles.css";

let projectList = [];
const control = controlLogic(); //cache first active project (which is null)

document.querySelector("#addProj").addEventListener("click", () => {
  let projectDialog = document.querySelector("#projectDialog");
  projectDialog.showModal();
});

document.querySelector(".project-submit").addEventListener("click", () => {
  let projectName = document.querySelector("#projectName").value;
  addNewProject(projectName);
});

//show tasks and render task button after choosing project
document.addEventListener("click", (e) => {
  if (e.target.matches(".project")) {
    projectList.forEach((item) => {
      //search for the seleceted project in the project list
      if (item.getName() == e.target.textContent) {
        control.updateActiveProject(item);
        document.querySelector(".desktop").innerHTML = ""; //clear task space to render a new list
        makeTaskBtn();
        showTasks();
      }
    });
  }
});

//add new task
document.addEventListener("click", (e) => {
  if (e.target.matches(".addTask")) {
    getTaskInfo();
  }
});

function addNewProject(name) {
  let newProject = makeProject(name);
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

function showTasks() {
  control
    .getActiveProject()
    .getTasks()
    .forEach((taskItem) => {
      let taskDiv = document.createElement("div");
      taskDiv.className = "task";
      taskDiv.textContent = `${taskItem.getDsc()} --- ${taskItem.getDueDate()}`;
      let workspace = document.querySelector(".desktop");
      workspace.insertBefore(taskDiv, document.querySelector(".addTask"));
    });
}

function addNewTask(title, description, date, priority) {
  let activeProject = control.getActiveProject();
  let newTask = makeTask(title, description, date, priority);
  activeProject.addTask(newTask);
}

const getTaskInfo = function () {
  let dialog = document.querySelector("dialog");
  dialog.showModal();
};

document.querySelector(".submit").addEventListener("click", (e) => {
  // e.preventDefault()
  document.querySelector(".desktop").innerHTML = "";
  let title = document.querySelector("#title").value;
  let description = document.querySelector("#description").value;
  let priority = document.querySelector('input[name="priority"]:checked').value;
  let date = document.getElementById("date").value;
  makeTaskBtn();
  addNewTask(title, description, date, priority);
  showTasks();
  document.querySelector("#taskForm").reset()
});
