const itemForm = document.querySelector(`#item-form`);
const itemInput = document.querySelector(`#item-input`);
const list = document.querySelector(`#item-list`);
const btnClearAll = document.querySelector(`#clear`);
const filterInput = document.querySelector(`#filter`);
const btnAddUpdate = itemForm.querySelector(`button`);

let editHelper = {
  inEditMode: false,
  currentEditItem: null,
  indexOfCurrEditItem: -1,
};

document.addEventListener(`DOMContentLoaded`, (e) => {
  const savedItems = getSavedItems();

  savedItems.forEach((item) => addItemToDOM(item));

  checkUI();
});

const onAddUpdateClicked = (e) => {
  e.preventDefault();
  const value = itemInput.value;
  itemInput.value = ``;
  if (value === ``) {
    alert(`please enter any item`);
    return;
  }

  if (editHelper.inEditMode) {
    allListItems = list.querySelectorAll(`li`);
    editHelper.indexOfCurrEditItem = Array.from(allListItems).indexOf(
      editHelper.currentEditItem
    );
    removeItem(editHelper.currentEditItem);

    setFormButtonStyleFor(`add`);
  }

  if (itemExists(value)) {
    alert("That item already exists");
    return;
  }

  addItemToDOM(value, editHelper.indexOfCurrEditItem);
  addItemToLocalStorage(value, editHelper.indexOfCurrEditItem);

  checkUI();
  resetEditHelper();
};

function itemExists(item) {
  return getSavedItems().includes(item);
}
function resetEditHelper() {
  editHelper.inEditMode = false;
  editHelper.currentEditItem = null;
  editHelper.indexOfCurrEditItem = -1;
}

function addItemToDOM(item, index = -1) {
  const li = document.createElement("li");

  const text = document.createTextNode(item);
  li.append(text);

  const btn = document.createElement(`button`);
  btn.className = `remove-item btn-link text-red`;
  const i = document.createElement(`i`);
  i.className = `fa-solid fa-xmark`;
  btn.insertAdjacentElement(`afterbegin`, i);
  li.insertAdjacentElement(`beforeend`, btn);
  if (index !== -1 && index !== list.children.length) {
    list.children[index].insertAdjacentElement(`beforebegin`, li);
  } else {
    list.insertAdjacentElement(`beforeend`, li);
  }
}

function addItemToLocalStorage(item, index = -1) {
  const savedItems = getSavedItems();
  if (index !== -1 && index !== list.children.length) {
    savedItems.splice(index, 0, item);
  } else {
    savedItems.push(item);
  }
  localStorage.setItem("items", JSON.stringify(savedItems));
}

function getSavedItems() {
  let savedItems = JSON.parse(localStorage.getItem(`items`));

  if (savedItems === null) {
    savedItems = [];
  }

  return savedItems;
}

function onItemClick(e) {
  if (e.target.parentElement.classList.contains(`remove-item`)) {
    if (confirm(`you sure wanna delete that??`)) {
      removeItem(e.target.parentElement.parentElement);
    }
  } else {
    const clickedItem = e.target;
    if (clickedItem.tagName === `LI`) {
      editHelper.inEditMode = true;
      // console.log(editHelper.inEditMode);

      if (editHelper.currentEditItem !== null) {
        editHelper.currentEditItem.style.color = `black`;
      }
      editHelper.currentEditItem = clickedItem;
      clickedItem.style.color = `#ccc`;

      itemInput.value = clickedItem.textContent;
      setFormButtonStyleFor(`update`);
    }
  }
}

function setFormButtonStyleFor(task) {
  btnAddUpdate.style.backgroundColor = task === `update` ? `green` : `black`;
  btnAddUpdate.innerHTML =
    task === `update`
      ? `<i class="fa-solid fa-pen"></i> Update Item`
      : `<i class="fa-solid fa-plus"></i> Add Item`;
}

function removeItem(item) {
  item.remove();
  checkUI();

  removeItemFromStorage(item.textContent);
}

function removeItemFromStorage(item) {
  let savedItems = getSavedItems();
  savedItems = savedItems.filter((i) => i !== item);
  localStorage.setItem("items", JSON.stringify(savedItems));
}

const onClearBtnClicked = (e) => {
  if (!list.firstElementChild) {
    alert(`nothing to clear`);
    return;
  }

  if (confirm(`you really wanna clear all??`)) {
    while (list.firstElementChild) {
      list.firstElementChild.remove();
    }

    localStorage.removeItem(`items`);

    checkUI();
  }
};

function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const items = list.querySelectorAll(`li`);

  items.forEach((item) => {
    const itemText = item.firstChild.textContent.toLocaleLowerCase();
    if (itemText.indexOf(text) === -1) {
      item.style.display = `none`;
    } else {
      item.style.display = `flex`;
    }
  });
}

function checkUI() {
  const itemsCount = list.children.length;
  if (itemsCount === 0) {
    btnClearAll.style.display = `none`;
    filterInput.style.display = `none`;
  } else {
    btnClearAll.style.display = `inline`;
    filterInput.style.display = `inline`;
  }
}

itemForm.addEventListener(`submit`, onAddUpdateClicked);
list.addEventListener(`click`, onItemClick);
btnClearAll.addEventListener(`click`, onClearBtnClicked);
filterInput.addEventListener(`input`, filterItems);
