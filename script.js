const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clrBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Display the items after page reload
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

// Adding an item
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create & add item to DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  // Create Button and adding icon
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button); // Adding the button to the list

  // Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

// Clicking the item event
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  }
  if (e.target.tagName === 'LI') {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  if (item.classList.contains('edit-mode')) {
    item.classList.remove('edit-mode');
    checkUI();
  } else {
    isEditMode = true;

    itemList
      .querySelectorAll('li')
      .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
  }
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from Storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  const newItemsOnStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(newItemsOnStorage));
}

// Clearing all item
function clearItems() {
  if (confirm('Are you sure?')) {
    // Clearing all item from DOM
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // Clearing all item from storage
    localStorage.removeItem('items');

    checkUI();
  }
}

// Filtering items
function filterItems(e) {
  const items = document.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function checkUI() {
  itemInput.value = '';

  const items = document.querySelectorAll('li');

  if (items.length === 0) {
    itemFilter.style.display = 'none';
    clrBtn.style.display = 'none';
  } else {
    itemFilter.style.display = 'block';
    clrBtn.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fas-solid fa-plus"></i> Add item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Initiallize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clrBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  document.body.addEventListener('click', removeEdit);

  checkUI();
}

init();

function removeEdit(e) {
  if (
    e.target.tagName === 'FORM' ||
    e.target.tagName === 'DIV' ||
    e.target.tagName === 'UL' ||
    e.target.tagName === 'IMG' ||
    e.target.tagName === 'H1' ||
    e.target.tagName === 'INPUT' ||
    e.target.tagName === 'BODY'
  ) {
    document
      .querySelectorAll('li')
      .forEach((item) => item.classList.remove('edit-mode'));
    checkUI();
  }
}
