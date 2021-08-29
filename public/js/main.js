let foldersEl = document.getElementsByClassName("folder-title");
let foldersContainer = document.querySelector(".folders-container");
let foldersMain = document.querySelector(".folders-main");
let folderMainInput = document.querySelector("#folder-name-input");
let taskListMainInput = document.querySelector("#tasklist-name-input");
let taskListContainer = document.querySelector(".tasklist-container");
let tasks = document.querySelector(".tasks");
let tasksUl = document.querySelector(".tasks ul");
let AddNewTaskInputDiv = document.querySelector(".add-new-task");
let AddNewTaskInput = document.querySelector("#newTask");
let addNewTaskPlus = document.querySelector(".plus");
let addNewFolderEl = document.querySelector(".add-new-folder");
let addNewFolderInput = document.querySelector(".add-new-folder input");

let folders = [];
let activeTaskList;
let activeFolderIndex;
let activeTaskListIndex;
let activeTaskListElement;
const getTasksByFolder = async (folder) => {
  return await fetch(`/tasklists/byfolder/${folder._id}`).then((data) =>
    data.json()
  );
};
const renderTaskList = async (folderIndex, tasklistIndex) => {
  const folder = folders[folderIndex];
  const tasklist = folder.tasklists[tasklistIndex];
  folderMainInput.value = folder.title;
  taskListMainInput.value = tasklist.title;
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
              <p class="task-main-text">${task.title} </p>
              <lord-icon class="remove-icon icon-hidden"
              src="https://cdn.lordicon.com/rivoakkk.json"
              trigger="hover"
              colors="primary:#191919,secondary:#ff8000"
              style="width:25px;height:25px">
          </lord-icon>
            </li>
    `;
  });
  AddNewTaskInputDiv.classList.remove("hidden");
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
  tasklists += `
  <li class="add-new-tasklist">
                <input
                  type="text"
                  name="newTasklist"
                  class="newTaskList"
                  placeholder="Add new List.."
                />
              </li>`;
  folder.innerHTML = `
  
  <div class="folder-title">
                  <button class="medium-text link-button">${data.title}</button>
                  <div class="folder-delete-container">
                    <lord-icon class="remove-icon icon-hidden"
                      src="https://cdn.lordicon.com/rivoakkk.json"
                      trigger="hover"
                      colors="primary:#191919,secondary:#ff8000"
                      style="width:25px;height:25px">
                    </lord-icon>
                  </div>
                </div>

                <div class="folder-tasks">
                  <ul class="tasks-list">
                  ${tasklists}
                  </ul>
                </div>
  `;
  foldersMain.appendChild(folder);
};
const updateFolderIndexes = () => {
  const foldersElements = foldersMain.childNodes;
  foldersElements.forEach(
    (folder, index) => (folder.dataset.folderIndex = index)
  );
};
const updateUI = () => {
  foldersMain.innerHTML = "";
  folders.forEach((folder, index) => {
    generateFolder(folder, index);
  });
  for (let i = 0; i < foldersEl.length; i++) {
    foldersEl[i].addEventListener("click", function (e) {
      if (e.target.classList.contains("remove-icon")) {
        const folder = e.target.closest(".folder");
        if (folder) {
          const folderElement =
            foldersMain.childNodes[folder.dataset.folderIndex];
          removeFolder(folderElement);
          folders.splice(folder.dataset.folderIndex, 1);
          console.log(folderElement);
          foldersMain.removeChild(folderElement);
          updateFolderIndexes();
        }
      } else {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
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
  const taskid = task.dataset.taskMainId;
  await fetch(`/tasklists/${activeTaskList}/markAsDone/${taskid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      folders[activeFolder].tasklists[activeTaskListIndex].tasks.find(
        (el) => el._id == taskid
      ).completed = true;

      task.classList.add("completed");
    });
};
const markAsIncomplete = async (task) => {
  const taskid = task.dataset.taskMainId;
  await fetch(`/tasklists/${activeTaskList}/markAsIncomplete/${taskid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      folders[activeFolder].tasklists[activeTaskListIndex].tasks.find(
        (el) => el._id == taskid
      ).completed = false;
      task.classList.remove("completed");
    });
};
const removeTask = async (task) => {
  const taskId = task.dataset.taskMainId;
  await fetch(`/tasklists/${activeTaskList}/removeTask/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      folders[activeFolder].tasklists[activeTaskListIndex].tasks = folders[
        activeFolder
      ].tasklists[activeTaskListIndex].tasks.filter(
        (task) => task._id != taskId
      );
      task.remove();
    });
};
const addTask = async (title) => {
  const tasklistId = folders[activeFolder].tasklists[activeTaskListIndex]._id;
  // console.log(tasklistId);
  await fetch(`/tasklists/addTask/${tasklistId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      folders[activeFolder].tasklists[activeTaskListIndex] = res;
      renderTasks(folders[activeFolder].tasklists[activeTaskListIndex].tasks);
    });
};
const addFolder = async (title) => {
  await fetch(`/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      res.tasklists = [];
      folders.push(res);
      // TODO: JUST ADD NEW FOLDER, WITHOUT UI UPDATING
      updateUI();
    });
};
const removeFolder = async (folder) => {
  const folderId = folders[folder.dataset.folderIndex]._id;
  await fetch(`/folders/${folderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => console.log("DELETED: ", res));
};
const changeFolderName = async (folderIndex, title) => {
  console.log("Folder index: ", folderIndex);
  console.log("Folder title: ", title);
  const folderId = folders[folderIndex]._id;
  await fetch(`/folders/${folderId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      folders[folderIndex].title = res.title;
      foldersMain
        .querySelectorAll(".folder")
        [folderIndex].querySelector("button.link-button").innerHTML = res.title;
    });
};
const addTaskList = async (folderIndex, title) => {
  const folderId = folders[folderIndex]._id;
  await fetch(`/tasklists/${folderId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      folders[folderIndex].tasklists.push(res);
    });
};
const changeListName = async (folderIndex, taskIndex, title) => {
  const tasklistId = folders[folderIndex].tasklists[taskIndex]._id;

  await fetch(`/tasklists/${tasklistId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      folders[folderIndex].tasklists[taskIndex].title = res.title;
      const task = foldersMain
        .querySelectorAll(".folder")
        [folderIndex].querySelectorAll(".tasks-list li")
        [taskIndex].querySelector(".task-text");
      task.innerHTML = `
        ${res.title}<span class="date-span">${getConvertedTime(
        res.updatedAt
      )}</span>
        `;
    });
};
foldersMain.addEventListener("click", (e) => {
  const tasklist = e.target.closest(".task");
  if (tasklist) {
    if (activeTaskListElement) {
      activeTaskListElement.classList.remove("active-tasklist");
    }
    const folder = e.target.closest(".folder");
    activeFolder = folder.dataset.folderIndex;
    activeTaskListIndex = tasklist.dataset.tasklistIndex;
    activeTaskList =
      folders[folder.dataset.folderIndex].tasklists[activeTaskListIndex]._id;
    tasklist.classList.add("active-tasklist");
    activeTaskListElement = tasklist;
    renderTaskList(folder.dataset.folderIndex, tasklist.dataset.tasklistIndex);
  }
});
foldersMain.addEventListener("keyup", async (e) => {
  if (e.target.classList.contains("newTaskList") && e.key === "Enter") {
    const tasklistTitle = e.target.value;
    const folderIndex = e.target.closest(".folder").dataset.folderIndex;
    await addTaskList(folderIndex, tasklistTitle);
    const tasklist =
      folders[folderIndex].tasklists[folders[folderIndex].tasklists.length - 1];
    const tasklistEl = document.createElement("li");
    tasklistEl.innerHTML = `<div class="task" data-task="${
      tasklist._id
    }" data-tasklist-index="${
      folders[folderIndex].tasklists.length - 1
    }"><p class="task-text">${
      tasklist.title
    }<span class="date-span">${getConvertedTime(
      tasklist.updatedAt
    )}</span></p></div>`;
    e.target
      .closest(".tasks-list")
      .insertBefore(tasklistEl, e.target.closest(".add-new-tasklist"));
    e.target.value = "";
  }
});
tasksUl.addEventListener("click", (e) => {
  const task = e.target.closest("li");
  if (task) {
    if (e.target.classList.contains("remove-icon")) {
      removeTask(task);
    } else {
      if (task.classList.contains("completed")) {
        markAsIncomplete(task);
      } else {
        markAsCompleted(task);
      }
    }
  }
});
AddNewTaskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTask(AddNewTaskInput.value);
    AddNewTaskInput.value = "";
  }
});
folderMainInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    changeFolderName(activeFolder, folderMainInput.value);
  }
});
taskListMainInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    console.log("Active folder: ", activeFolder);
    console.log("Active list: ", activeTaskListIndex);
    changeListName(activeFolder, activeTaskListIndex, taskListMainInput.value);
  }
});
addNewFolderInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addFolder(addNewFolderInput.value);
    addNewFolderInput.value = "";
    addNewFolderEl.classList.add("hidden");
  }
});
addNewTaskPlus.addEventListener("click", (e) => {
  addNewFolderEl.classList.remove("hidden");
  addNewFolderEl.querySelector("input").focus();
});
getFolders();
