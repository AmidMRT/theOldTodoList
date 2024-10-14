import { controlLogic, makeProject, makeTask } from "./app";
import "./styles.css";

let projectList = [];
const control = controlLogic(); //cache first active project (which is null)

const desktop = document.querySelector(".desktop");

document.querySelector("#addProj").addEventListener("click", () => {
  let projectDialog = document.querySelector("#projectDialog");
  projectDialog.showModal();
});

document.querySelector(".project-submit").addEventListener("click", () => {
  let recievedName = document.querySelector("#projectName").value;
  //check for empty and duplicate
  if (!recievedName == "" && !checkForDupProject(recievedName)) {
    let projectName = recievedName;
    let newProject = addNewProjectToArr(projectName);
    addProjectToDOM(newProject);
    document.querySelector("#projectForm").reset();
    document.querySelector("#projectDialog").close();
  } else if (checkForDupProject(recievedName)) {
    alert(
      `already have a project with the name "${recievedName}", please use another name`
    );
  } else {
    alert("project name can't be empty");
  }
});

function checkForDupProject(name) {
  if (projectList.map((project) => project.getName()).includes(name)) {
    return true;
  } else {
    return false;
  }
}

//show tasks and render task button after choosing project
document.addEventListener("click", (e) => {
  if (e.target.matches(".project")) {
    document.querySelectorAll(".project").forEach((element)=> element.id = "inactive")
    projectList.forEach((item) => {
      //search for the seleceted project in the project list
      if (item.getName() == e.target.textContent) {
        control.updateActiveProject(item);
        e.target.id = "active";
        renderWorkSpace();
      }
    });
  }
});

function renderWorkSpace() {
  desktop.innerHTML = ""; //clear task space to render a new list
  makeTaskBtn();
  showTasks();
}

//add new task
document.addEventListener("click", (e) => {
  if (e.target.matches(".addTask")) {
    getTaskInfo();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".removeBtn")) {
    let projectName = e.target.previousElementSibling.textContent;
    removeProjectFromArr(projectName);
    let container = e.target.parentElement;
    document.querySelector(".leftBar").removeChild(container);
    if (checkIfActive(projectName)) {
      desktop.textContent = "Please choose/add a project";
    }
  }
});

function checkIfActive(projectName) {
  if (
    !control.getActiveProject() == null &&
    !control.getActiveProject().getName() == projectName
  ) {
    return false;
  } else {
    return true;
  }
}

document.querySelector(".task-submit").addEventListener("click", (e) => {
  // e.preventDefault()
  let title = document.querySelector("#title").value;
  let description = document.querySelector("#description").value;
  let priority = document.querySelector('input[name="priority"]:checked').value;
  let date = document.getElementById("date").value;
  if (!title == "") {
    addNewTask(title, description, date, priority);
    renderWorkSpace();
    document.querySelector("#taskForm").reset();
    document.querySelector("#taskDialog").close();
  } else {
    alert("you should at least enter a name for your task");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".removeTask")) {
    let taskDiv = e.target.parentElement;
    let relatedTaskIndex = Array.from(taskDiv.parentElement.children).indexOf(
      taskDiv
    );
    control.getActiveProject().getTasks().splice(relatedTaskIndex, 1);
    renderWorkSpace();
  }
});

document.querySelector(".task-close").addEventListener("click", () => {
  document.querySelector("#taskDialog").close();
});

function addNewProjectToArr(name) {
  let newProject = makeProject(name);
  projectList.push(newProject);
  return newProject;
}

function addProjectToDOM(newProject) {
  const projectBar = document.querySelector(".leftBar");
  let projContainer = document.createElement("div");
  projContainer.className = "projContainer";
  let project = document.createElement("button");
  project.className = "project";
  project.textContent = newProject.getName();
  let rmvBtn = document.createElement("button");
  rmvBtn.textContent = "X";
  rmvBtn.className = "removeBtn";
  projContainer.appendChild(project);
  projContainer.appendChild(rmvBtn);
  projectBar.insertBefore(projContainer, projectBar.querySelector("#addProj"));
}

function removeProjectFromArr(projectName) {
  projectList.forEach((item) => {
    if (item.getName() == projectName) {
      projectList.splice(projectList.indexOf(item), 1);
    }
  });
}

function makeTaskBtn() {
  let taskBtn = document.createElement("button");
  taskBtn.className = "addTask";
  taskBtn.textContent = "+ Add Task";
  desktop.appendChild(taskBtn);
}

function showTasks() {
  control
    .getActiveProject()
    .getTasks()
    .forEach((taskItem) => {
      let taskDiv = document.createElement("div");
      let rmvTask = document.createElement("button");
      rmvTask.className = "removeTask";
      rmvTask.textContent = "X";
      taskDiv.className = "task";
      taskDiv.textContent = `${taskItem.getTtl()} --- Priority: ${taskItem.getPriority()}`;
      taskDiv.appendChild(rmvTask);
      let workspace = desktop;
      workspace.insertBefore(taskDiv, document.querySelector(".addTask"));
    });
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".task")) {
    document.querySelector("#editDialog").showModal();
    let taskDiv = e.target;
    let relatedTaskIndex = Array.from(taskDiv.parentElement.children).indexOf(
      taskDiv
    );
    let targetTask = control.getActiveProject().getTasks()[relatedTaskIndex];
    let title = targetTask.getTtl();
    let dueDate = targetTask.getDueDate();
    let priority = targetTask.getPriority();
    let description = targetTask.getDsc();
    document.querySelector("#editDialog").querySelector("#title").value = title;
  }
});

function addNewTask(title, description, date, priority) {
  let activeProject = control.getActiveProject();
  let newTask = makeTask(title, description, date, priority);
  activeProject.addTask(newTask);
}

const getTaskInfo = function () {
  let dialog = document.querySelector("#taskDialog");
  dialog.showModal();
};
