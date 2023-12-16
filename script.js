const todoData = document.querySelector(`#todo-data`);
const todoSubmit = document.querySelector(`.add-todo`);
const textArea = document.querySelector(`#todo-text-area`);
const dateInput = document.querySelector(`#todo-data input[type="date"]`);
const priorityContainer = document.querySelector(`#radios`);
const statusContainer = document.querySelector(`#status`);
const list = document.querySelector(`#todo-list`);
const tasks = document.querySelector(`#todo-list #items`);
const search = document.querySelector(`#search`);
let taskToEdit = null;

const startedList = document.querySelector(`#started #items`);

const completedList = document.querySelector(`#completed #items`);

console.log(tasks);

function init() {
  const savedTasks = getSavedTasks();
  savedTasks.forEach((item) => {
    addToDom(item.task, item.date, item.prio, item.stat);
  });

  let tasks = document.querySelector(`#todo-list #items`);
  if (tasks.children.length === 0) {
    const img = document.querySelector(`img`);
    img.src = `images/Empty.png`;
  }

  tasks = document.querySelector(`#started #items`);

  if (tasks.children.length === 0) {
    const img = document.querySelector(`img`);
    img.src = `images/Empty.png`;
  }

  tasks = document.querySelector(`#started #items`);

  if (tasks.children.length === 0) {
    const img = document.querySelector(`img`);
    img.src = `images/Empty.png`;
  }
}

function addTask() {
  let prio = false;
  priorityContainer.querySelectorAll(`input`).forEach((inp) => {
    if (inp.checked) {
      prio = inp.value;
    }
  });

  let status = false;
  statusContainer.querySelectorAll(`input`).forEach((inp) => {
    if (inp.checked) {
      status = inp.value;
    }
  });

  if (
    prio === false ||
    status === false ||
    textArea.value === `` ||
    dateInput.value === ``
  ) {
    alert(`please provide all values`);
    return;
  }

  addToDom(textArea.value, dateInput.value, prio, status);
  addToStorage(textArea.value, dateInput.value, prio, status);

  textArea.value = ``;
  dateInput.value = ``;
}

function onEdit(e) {
  taskToEdit = e.target.parentElement.parentElement.parentElement.parentElement;
  textArea.value = taskToEdit.lastChild.textContent;
  const status = taskToEdit.querySelector(`.status`).textContent.split(`:`)[1];
  console.log(status);
  console.log(
    `date is `,
    taskToEdit.querySelector(`.deadline`).textContent.split(`:`)[1].trim()
  );
  dateInput.value = taskToEdit
    .querySelector(`.deadline`)
    .textContent.split(`:`)[1]
    .trim();
  const prio = taskToEdit.querySelector(`.priority`).textContent.split(`:`)[1];
  console.log(prio);
  todoData.querySelector(`input[value=${status}]`).checked = true;
  todoData.querySelector(`input[value=${prio}]`).checked = true;
  todoSubmit.click();

  todoSubmit.innerHTML = `<i class="fa-solid fa-pencil"></i> update`;
  todoData.classList.add(`update`);
}

function onDelete(e) {
  const itemToDelete =
    e.target.parentElement.parentElement.parentElement.parentElement;
  const savedTasks = getSavedTasks();
  savedTasks.forEach((item) => {
    if (item.task === itemToDelete.lastChild.textContent) {
      savedTasks.splice(savedTasks.indexOf(item), 1);
    }
  });
  itemToDelete.remove();

  console.log(savedTasks);
}

function updateTask() {
  taskToEdit.lastChild.textContent = textArea.value;
  taskToEdit.querySelector(
    `.deadline`
  ).textContent = `Deadline: ${dateInput.value}`;
  let prio = false;
  priorityContainer.querySelectorAll(`input`).forEach((inp) => {
    if (inp.checked) {
      prio = inp.value;
    }
  });

  let status = false;
  statusContainer.querySelectorAll(`input`).forEach((inp) => {
    if (inp.checked) {
      status = inp.value;
    }
  });
  taskToEdit.querySelector(`.priority`).textContent = `Priority: ${prio}`;
  taskToEdit.querySelector(`.status`).textContent = `Status: ${status}`;
  taskToEdit.remove();
  let tasks = null;
  if (stat === `todo`) {
    tasks = document.querySelector(`#todo-list #items`);
  } else if (stat === `started`) {
    tasks = document.querySelector(`#started #items`);
  } else if (stat === `completed`) {
    tasks = document.querySelector(`#completed #items`);
  }

  tasks.append(taskToEdit);
}
function addToDom(task, date, prio, stat) {
  console.log();

  const div = document.createElement(`div`);
  div.classList.add(`task`);
  // div.innerHTML= `
  // <div class= "first">
  //   <span class="deadline">Deadline: ${date}</span>
  //   <span class= "priority">Priority: ${prio}</span>
  //   <span class="buttons">
  //     <button id= "delete">
  //     <i class="fa-solid fa-trash"></i>
  //     </button>

  //     <button id= "edit">
  //     <i class="fa-solid fa-pencil"></i>
  //     </button>

  //     </span>

  // </div>
  // <div>
  //   ${task}
  // </div>
  // `;

  const first = document.createElement(`div`);
  first.classList.add(`first`);

  const deadline = document.createElement(`span`);
  deadline.classList.add(`deadline`);
  deadline.appendChild(document.createTextNode(`Deadline: ${date}`));

  const priority = document.createElement(`span`);
  priority.classList.add(`priority`);
  priority.appendChild(document.createTextNode(`Priority: ${prio}`));

  const status = document.createElement(`span`);
  status.classList.add(`status`);
  status.appendChild(document.createTextNode(`Status: ${stat}`));

  const buttons = document.createElement(`span`);
  buttons.classList.add(`buttons`);

  const edit = document.createElement(`button`);
  edit.innerHTML = ` <i class="fa-solid fa-pencil"></i>`;
  edit.addEventListener(`click`, onEdit);

  const deleteBtn = document.createElement(`button`);
  deleteBtn.innerHTML = ` <i class="fa-solid fa-trash"></i>`;
  deleteBtn.addEventListener(`click`, onDelete);

  buttons.append(edit, deleteBtn);

  first.append(deadline, priority, status, buttons);
  const taskDiv = document.createElement(`div`);
  taskDiv.classList.add(`taskDiv`);
  taskDiv.appendChild(document.createTextNode(task));
  div.append(first, taskDiv);
  let tasks = null;
  if (stat === `todo`) {
    tasks = document.querySelector(`#todo-list #items`);
  } else if (stat === `started`) {
    tasks = document.querySelector(`#started #items`);
  } else if (stat === `completed`) {
    tasks = document.querySelector(`#completed #items`);
  }
  tasks.append(div);
}

function addToStorage(task, date, prio, stat) {
  const item = {
    task,
    date,
    prio,
    stat,
  };

  let savedTasks = getSavedTasks();
  savedTasks.push(item);
  localStorage.setItem(`tasks`, JSON.stringify(savedTasks));
}

function getSavedTasks() {
  let list = localStorage.getItem(`tasks`);
  if (list === null) {
    list = [];
  } else {
    list = JSON.parse(list);
  }
  return list;
}
todoSubmit.addEventListener(`click`, (e) => {
  e.preventDefault();
  if (todoData.classList.contains(`show`)) {
    todoData.classList.remove(`show`);
    todoSubmit.innerHTML = `Create ToDo`;
    if (!todoSubmit.classList.contains(`update`)) {
      addTask();
    } else {
      updateTask();
    }
  } else {
    todoData.classList.add(`show`);
    todoSubmit.innerHTML = `<i class="fa-solid fa-plus"></i>
      Add`;
  }
});
search.addEventListener(`input`, (e) => {
  Array.from(startedList.children).forEach((item) => {
    itemText = item
      .querySelector(`.taskDiv`)
      .textContent.toLocaleLowerCase()
      .trim();
    const searchText = search.value.toLocaleLowerCase().trim();
    if (itemText.indexOf(searchText) === -1) {
      item.style.display = `none`;
    } else {
      item.style.display = `initial`;
    }
  });

  Array.from(tasks.children).forEach((item) => {
    itemText = item
      .querySelector(`.taskDiv`)
      .textContent.toLocaleLowerCase()
      .trim();
    const searchText = search.value.toLocaleLowerCase().trim();
    if (itemText.indexOf(searchText) === -1) {
      item.style.display = `none`;
    } else {
      item.style.display = `initial`;
    }
  });

  Array.from(completedList.children).forEach((item) => {
    itemText = item
      .querySelector(`.taskDiv`)
      .textContent.toLocaleLowerCase()
      .trim();
    const searchText = search.value.toLocaleLowerCase().trim();
    if (itemText.indexOf(searchText) === -1) {
      item.style.display = `none`;
    } else {
      item.style.display = `initial`;
    }
  });
});
window.addEventListener(`DOMContentLoaded`, init);
