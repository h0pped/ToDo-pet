let foldersEl = document.getElementsByClassName("folder-title");
let foldersContainer = document.querySelector(".folders-container");

const getTasksByFolder = async (folder) => {
  return await fetch(`/tasks/byfolder/${folder._id}`).then((data) =>
    data.json()
  );
};
const getFolders = async () => {
  const fetchedFolders = await fetch("/folders").then((data) => data.json());

  for (let i = 0; i < fetchedFolders.length; i++) {
    fetchedFolders[i].tasks = await getTasksByFolder(fetchedFolders[i]);
  }
  folders = fetchedFolders;
  console.log(folders);
  updateUI();
};

const generateFolder = (data) => {
  const folder = document.createElement("div");

  folder.classList.add("folder");
  console.log(data.tasks);
  let tasks = "";

  data.tasks.forEach((task) => {
    tasks += `<li><div class="task" data-task="${
      task._id
    }"><p class="task-text">${
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
                  ${tasks}
                  </ul>
                </div>
  `;
  foldersContainer.appendChild(folder);
};

const updateUI = () => {
  folders.forEach((folder) => {
    generateFolder(folder);
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

foldersContainer.addEventListener("click", (e) => {
  const task = e.target.closest(".task");
  if (task) {
    console.log(task.dataset.task);
  }
});

getFolders();
