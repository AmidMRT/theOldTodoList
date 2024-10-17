const makeTask = function (title, description, date, importance) {
  let ttl = title;
  let dsc = description;
  let priority = importance;
  let dueDate = date;
  let project = controlLogic().getActiveProject();
  const getTtl = () => ttl;
  const getDsc = () => dsc;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getProject = () => project;
  return {
    getTtl,
    getDsc,
    getProject,
    getDueDate,
    getPriority,
  };
};

const makeProject = function (projName) {
  let name = projName;
  let tasks = [];
  const getName = () => name;
  const getTasks = () => tasks;
  const addTask = (task) => tasks.push(task);
  return {
    getName,
    getTasks,
    addTask,
  };
};

const controlLogic = function () {
  let activeProject = null;
  let activeTask = null;
  const getActiveProject = () => activeProject;
  const updateActiveProject = (proj) => (activeProject = proj);
  const getActiveTask = () => activeTask;
  const updateActiveTask = (task) => (activeTask = task);
  return {
    getActiveProject,
    updateActiveProject,
    getActiveTask,
    updateActiveTask,
  };
};

export { makeTask, makeProject, controlLogic };
