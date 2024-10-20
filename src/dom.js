// import { JavascriptModulesPlugin } from "webpack";
import { controlLogic, makeProject, makeTask } from "./app";
import "./styles.css";

let projectList = [];
const control = controlLogic(); //cache first active project (which is null)
const desktop = document.querySelector(".desktop");
let savedData = {};
let previousSessionData = JSON.parse(localStorage.getItem("todoInfo"));

console.log(JSON.parse(localStorage.getItem("todoInfo")));

const renderPrevious = (function () {
  if (
    previousSessionData != null &&
    Object.keys(previousSessionData).length > 2
  ) {
    savedData = previousSessionData;
    for (let i = 0; i < Object.keys(savedData).length; i++) {
      console.log(Object.keys(savedData).length);
    }
    rebuildPreviousInfo();
  }
})();

function rebuildPreviousInfo() {
  for (let i = 0; i < Object.keys(savedData).length - 2; i++) {
    let project = makeProject(savedData[i].name);
    for (let j = 0; j < Object.keys(savedData[i]).length-1 ; j++) {
      let task = makeTask(
        savedData[i][`task${j}`].name,
        savedData[i][`task${j}`].description,
        savedData[i][`task${j}`].date,
        savedData[i][`task${j}`].priority
      );
      console.log(task)
      project.addTask(task);
      if (savedData.activeTask == task.getTtl()) {
        control.updateActiveTask(task);
      }
    }
    if (savedData.activeProject == project.getName()) {
      control.updateActiveProject(project);
    }
    projectList.push(project);
    addProjectToDOM(project);
    console.log(project.getTasks())
  }
}

const addProject = (function () {
  document.querySelector("#addProj").addEventListener("click", () => {
    let projectDialog = document.querySelector("#projectDialog");
    projectDialog.showModal();
  });
})();

const submitProject = (function () {
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
})();

function checkForDupProject(name) {
  if (projectList.map((project) => project.getName()).includes(name)) {
    return true;
  } else {
    return false;
  }
}

//show tasks and render task button after choosing project
const renderWorkspaceAfterClickingProject = (function () {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".project")) {
      document
        .querySelectorAll(".project")
        .forEach((element) => (element.id = "inactive"));
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
})();

function renderWorkSpace() {
  desktop.innerHTML = ""; //clear task space to render a new list
  makeTaskBtn();
  showTasks();
}

const addTask = (function () {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".addTask")) {
      getTaskInfo();
    }
  });
})();

const removeProject = (function () {
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
})();

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

const submitTask = (function () {
  document.querySelector(".task-submit").addEventListener("click", (e) => {
    let title = document.querySelector("#title").value;
    let description = document.querySelector("#description").value;
    let priority = document.querySelector(
      'input[name="priority"]:checked'
    ).value;
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
})();

const submitEditTask = (function () {
  document.querySelector(".edit-task-submit").addEventListener("click", () => {
    let title = document.querySelector("#edit-title").value;
    let description = document.querySelector("#edit-description").value;
    let priority = document.querySelector(
      'input[name="edit-priority"]:checked'
    ).value;
    let date = document.querySelector(".edit-date").value;
    if (!title == "") {
      let editedTask = makeTask(title, description, date, priority);
      control
        .getActiveProject()
        .getTasks()
        .forEach((item, index) => {
          if (item == control.getActiveTask()) {
            control.getActiveProject().getTasks().splice(index, 1, editedTask);
            control.updateActiveTask(editedTask);
          }
        });
      renderWorkSpace();
      document.querySelector("#taskEditForm").reset();
      document.querySelector("#editDialog").close();
    } else {
      alert("you should at least enter a name for your task");
    }
  });
})();

const removeTask = (function () {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".removeTask")) {
      let taskDiv = e.target.parentElement;
      let relatedTaskIndex = Array.from(
        document.querySelectorAll(".task")
      ).indexOf(taskDiv);
      control.getActiveProject().getTasks().splice(relatedTaskIndex, 1);
      renderWorkSpace();
    }
  });
})();

const editTask = (function () {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".task")) {
      let editTaskDialog = document.querySelector("#editDialog");
      editTaskDialog.showModal();
      let taskDiv = e.target;
      let relatedTaskIndex = Array.from(
        document.querySelectorAll(".task")
      ).indexOf(taskDiv);
      let targetTask = control.getActiveProject().getTasks()[relatedTaskIndex];
      let title = targetTask.getTtl();
      let dueDate = targetTask.getDueDate();
      let priority = targetTask.getPriority();
      let description = targetTask.getDsc();
      editTaskDialog.querySelector("#edit-title").value = title;
      editTaskDialog.querySelector("#edit-description").value = description;
      editTaskDialog.querySelector(".edit-date").value = date;
      editTaskDialog
        .querySelector(".edit-priority-section")
        .querySelector(`#${priority.toLowerCase()}`).checked = true;
      editTaskDialog.querySelector("#date").value = dueDate;
      control.updateActiveTask(targetTask);
    }
  });
})();

const addTaskDialogCancel = (function () {
  document.querySelector(".task-close").addEventListener("click", () => {
    document.querySelector("#taskDialog").close();
    document.querySelector("#taskForm").reset();
  });
})();

const editTaskDialogCancel = (function () {
  document.querySelector(".edit-task-close").addEventListener("click", () => {
    document.querySelector("#editDialog").close();
    document.querySelector("#taskEditForm").reset();
  });
})();

const projectCancel = (function () {
  document.querySelector(".project-close").addEventListener("click", () => {
    document.querySelector("#projectDialog").close();
    document.querySelector("#projectForm").reset();
  });
})();

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
      if (!taskItem.getDueDate() == "") {
        taskDiv.textContent = `${taskItem.getTtl()} --- Date: ${taskItem.getDueDate()}`;
      } else {
        taskDiv.textContent = `${taskItem.getTtl()}`;
      }
      if (taskItem.getPriority() == "High") {
        taskDiv.id = "highPriority";
      } else if (taskItem.getPriority() == "Low") {
        taskDiv.id = "lowPriority";
      } else {
        taskDiv.id = "mediumPriority";
      }
      taskDiv.appendChild(rmvTask);
      let workspace = desktop;
      workspace.insertBefore(taskDiv, document.querySelector(".addTask"));
    });
}

function addNewTask(title, description, date, priority) {
  let activeProject = control.getActiveProject();
  let newTask = makeTask(title, description, date, priority);
  activeProject.addTask(newTask);
}

function getTaskInfo() {
  let dialog = document.querySelector("#taskDialog");
  dialog.showModal();
}

//localStorage control

window.addEventListener("beforeunload", () => {
  localStorage.clear();
  let outputObj = {};
  if (projectList.length > 0) {
    projectList.forEach((project, projectIndex) => {
      let projectObj = {};
      projectObj.name = project.getName();
      project.getTasks().forEach((task, taskIndex) => {
        let taskKey = `task${taskIndex}`;
        projectObj[taskKey] = {
          name: task.getTtl(),
          description: task.getDsc(),
          date: task.getDueDate(),
          priority: task.getPriority(),
        };
      });
      outputObj[projectIndex] = projectObj;
    });
  }
  projectList = [];
  outputObj.activeProject =
    control.getActiveProject() != null
      ? control.getActiveProject().getName()
      : null;
  outputObj.activeTask =
    control.getActiveTask() != null ? control.getActiveTask().getTtl() : null;
  localStorage.setItem("todoInfo", JSON.stringify(outputObj));
});
