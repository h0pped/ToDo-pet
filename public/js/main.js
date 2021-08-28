let foldersEl = document.getElementsByClassName("folder-title");
let foldersContainer = document.querySelector(".folders-container");
let folderMainTitle = document.querySelector("#folder-main-title");
let taskListMainTitle = document.querySelector("#tasklist-main-title");
let taskListContainer = document.querySelector(".tasklist-container");
let tasks = document.querySelector(".tasks");
let tasksUl = document.querySelector(".tasks ul");

let folders = [];
const getTasksByFolder = async (folder) => {
  return await fetch(`/tasklists/byfolder/${folder._id}`).then((data) =>
    data.json()
  );
};
const renderTaskList = async (folderIndex, tasklistIndex) => {
  const folder = folders[folderIndex];
  const tasklist = folder.tasklists[tasklistIndex];
  folderMainTitle.innerHTML = folder.title;
  taskListMainTitle.innerHTML = tasklist.title;
  renderTasks(tasklist.tasks);
};
const renderTasks = (tasks) => {
  tasksUl.innerHTML = "";
  let tasksRender = "";
  tasks.forEach((task) => {
    tasksRender += `
    <li class="task-main ${
      task.completed === true ? "completed" : ""
    }" data-task-main-id="${task._id}">
              <p class="task-main-text">${task.title}</p>
            </li>
    `;
  });
  tasksUl.innerHTML = tasksRender;
};
const getFolders = async () => {
  const fetchedFolders = await fetch("/folders").then((data) => data.json());

  for (let i = 0; i < fetchedFolders.length; i++) {
    fetchedFolders[i].tasklists = await getTasksByFolder(fetchedFolders[i]);
  }
  folders = fetchedFolders;
  updateUI();
};

const generateFolder = (data, index) => {
  const folder = document.createElement("div");

  folder.classList.add("folder");
  folder.dataset.folderIndex = index;
  console.log(data);
  let tasklists = "";

  data.tasklists.forEach((task, index) => {
    tasklists += `<li><div class="task" data-task="${
      task._id
    }" data-tasklist-index="${index}"><p class="task-text">${
      task.title
    }<span class="date-span">${getConvertedTime(
      task.updatedAt
    )}</span></p></div></li>`;
  });
  folder.innerHTML = `
  <div class="folder-title">
                  <button class="medium-text link-button">${data.title}</button>
                </div>
                <div class="folder-tasks">
                  <ul class="tasks-list">
                  ${tasklists}
                  </ul>
                </div>
  `;
  foldersContainer.appendChild(folder);
};

const updateUI = () => {
  folders.forEach((folder, index) => {
    generateFolder(folder, index);
  });
  for (let i = 0; i < foldersEl.length; i++) {
    foldersEl[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
};

const getConvertedTime = (time) => {
  const newTime = new Date(time);
  return (
    newTime.toLocaleDateString("en-US") +
    " " +
    newTime.toLocaleTimeString("en-US")
  );
};
const markAsCompleted = async (task) => {
  console.log("TO COMPLITE: ", task);
};
const markAsUncompleted = async (task) => {
  console.log("TO UNCOMPLITE: ", task);
};

foldersContainer.addEventListener("click", (e) => {
  const tasklist = e.target.closest(".task");
  if (tasklist) {
    const folder = e.target.closest(".folder");
    console.log("Folder index: ", folder.dataset.folderIndex);
    console.log("List index: ", tasklist.dataset.tasklistIndex);
    renderTaskList(folder.dataset.folderIndex, tasklist.dataset.tasklistIndex);
  }
});
tasksUl.addEventListener("click", (e) => {
  const task = e.target.closest("li");
  if (task) {
    if (task.classList.contains("completed")) {
      markAsCompleted(task);
    } else {
      markAsUncompleted(task);
    }
  }
});
getFolders();
