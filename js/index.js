"use strict";
//==========================================

import {
  noText,
  getTasksLocalStorage,
  setTasksLocalStorage,
  generateUniqueId,
  initSortableList,
  updateListTasks,
} from "./utils.js";

const form = document.querySelector(".form");
const textareaForm = document.querySelector(".form__textarea");
const buttonSendForm = document.querySelector(".form__send-btn");
const buttonCancel = document.querySelector(".form__cancel-btn");
const output = document.querySelector(".output");
let editId = null;
let isEditTask = false;

updateListTasks();

form.addEventListener("submit", sendTask);
buttonCancel.addEventListener("click", resetSendForm);
output.addEventListener("dragover", initSortableList);
output.addEventListener("dragenter", (event) => event.preventDefault());

function sendTask() {
  event.preventDefault();

  const task = textareaForm.value.trim().replace(/\s+/g, " "); //trim заменят множество пробелов на 1
  if (!task || "") {
    return noText(); //popup окно об ошибке пустого вэлью
  }

  if (isEditTask) {
    saveEditedTesk(task);
    return;
  }

  const arrayTaskLS = getTasksLocalStorage();
  arrayTaskLS.push({
    id: generateUniqueId(),
    task,
    done: false,
    pinned: false,
    position: 1000,
  });

  setTasksLocalStorage(arrayTaskLS);
  updateListTasks();

  form.reset();
}

output.addEventListener("click", (event) => {
  const taskElement = event.target.closest(".task__btns");
  if (!taskElement) return;

  if (event.target.closest(".task__pinned")) {
    pinnedTask(event);
  } else if (event.target.closest(".task__edit")) {
    editTask(event);
  } else if (event.target.closest(".task__del")) {
    delTask(event);
  } else if (event.target.closest(".task__done")) {
    doneTask(event);
  }
});

function doneTask(event) {
  const task = event.target.closest(".task");
  const id = Number(task.dataset.taskId);

  const arrayTasksLS = getTasksLocalStorage();
  const index = arrayTasksLS.findIndex((task) => task.id === id);
  console.log(index);

  //-1 выдает когда не существует такого индекса
  if (index === -1) {
    return alert("такая задача не найдена");
  }

  if (!arrayTasksLS[index].done && arrayTasksLS[index].pinned) {
    arrayTasksLS[index].pinned = false;
  }

  if (arrayTasksLS[index].done) {
    arrayTasksLS[index].done = false;
  } else {
    arrayTasksLS[index].done = true;
  }
  setTasksLocalStorage(arrayTasksLS);
  updateListTasks();
}

function pinnedTask(event) {
  const task = event.target.closest(".task");
  const id = Number(task.dataset.taskId);

  const arrayTasksLS = getTasksLocalStorage();
  const index = arrayTasksLS.findIndex((task) => task.id === id);
  console.log(index);

  //-1 выдает когда не существует такого индекса
  if (index === -1) {
    return alert("такая задача не найдена");
  }
  if (!arrayTasksLS[index].pinned && arrayTasksLS[index].done) {
    return alert(
      "Чтобы завершить задачу , сначало уберите отметку о выполнении"
    );
  }
  if (arrayTasksLS[index].pinned) {
    arrayTasksLS[index].pinned = false;
  } else {
    arrayTasksLS[index].pinned = true;
  }
  setTasksLocalStorage(arrayTasksLS);
  updateListTasks();
}

function delTask() {
  const task = event.target.closest(".task");
  const id = Number(task.dataset.taskId);

  const arrayTasksLS = getTasksLocalStorage();
  const newTasksArr = arrayTasksLS.filter((task) => task.id !== id); //собираем в новый массив через филтер все элменты кроме того по которому произошло собыитие
  setTasksLocalStorage(newTasksArr);
  updateListTasks();
}

function editTask() {
  const task = event.target.closest(".task");
  const text = task.querySelector(".task__text");
  editId = Number(task.dataset.taskId);

  textareaForm.value = text.textContent;
  isEditTask = true;
  buttonSendForm.textContent = "Сохранить";
  buttonCancel.classList.remove("none");
  form.scrollIntoView({ behavior: "smooth" });
}

function saveEditedTesk(task) {
  const arrayTaskLS = getTasksLocalStorage();
  const editedTaskIndex = arrayTaskLS.findIndex((task) => task.id === editId);

  if (editedTaskIndex !== -1) {
    arrayTaskLS[editedTaskIndex].task = task;
    setTasksLocalStorage(arrayTaskLS);
    updateListTasks();
  } else {
    alert("Такая задача не найдена");
  }
  resetSendForm();
}

function resetSendForm() {
  editId = null;
  isEditTask = false;
  buttonCancel.classList.add("none");
  buttonSendForm.textContent = "Добавить";
  form.reset();
}
