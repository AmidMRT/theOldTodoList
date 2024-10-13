const makeTask = function (title, description) {
  let ttl = title;
  let dsc = description;
  let project = controlLogic().getActiveProject();
  const getTtl = () => ttl;
  const getDsc = () => dsc;
  const getProject = () => project;
  return {
    getTtl,
    getDsc,
    getProject,
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
  const getActiveProject = () => activeProject;
  const updateActiveProject = (proj) => (activeProject = proj);
  return {
    getActiveProject,
    updateActiveProject,
  };
};

export { makeTask, makeProject, controlLogic };
