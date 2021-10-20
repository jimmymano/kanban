// Const's for HTML elements
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists (Unodered lists that hold all our items)
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;


// Initialize Arrays (stores data for each of our lists)
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays =[];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
} 


// Set localStorage Arrays
function updateSavedColumns() {
listArrays=[backlogListArray,progressListArray,completeListArray,onHoldListArray];

const arrayNames = ['backlog','progress', 'complete','onHold'];
arrayNames.forEach((arrayNames,index)=>{
    localStorage.setItem(`${arrayNames}Items`,JSON.stringify(listArrays[index]));
});

//   localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
//   localStorage.setItem('progressItems', JSON.stringify(progressListArray));
//   localStorage.setItem('completeItems', JSON.stringify(completeListArray));
//   localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {

  // Create List Item, add drag-item class to list element, text content of list element is equal to item param
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
//   Makes list element draggable
listEl.draggable = true;
listEl.setAttribute('ondragstart','drag(event)')

    //   Append
    columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
if(!updatedOnLoad){
    getSavedColumns();
}
  // Backlog Column
backlogList.textContent = '';
backlogListArray.forEach((backlogItems,index)=>{
createItemEl(backlogList,0,backlogItems,index);
});
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItems,index)=>{
  createItemEl(progressList,0,progressItems,index);
  });
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItems,index)=>{
  createItemEl(completeList,0,completeItems,index);
  });
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItems,index)=>{
  createItemEl(onHoldList,0,onHoldItems,index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Add to column list,Reset text box
function addToColumn(column){
   const itemText = addItems[column].textContent;
   const selectedArray = listArrays[column];
   selectedArray.push(itemText);
   addItems[column].textContent = '';
   updateDOM();
}


// Show add item input box
function showInputBox(column){
addBtns[column].style.visibility = 'hidden';
saveItemBtns[column].style.display = 'flex';
addItemContainers[column].style.display = 'flex';
}

// Hide item input box
function hideInputBox(column){
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}

// Allow arrays to reflect drag and drop items
function rebuildArrays(){
console.log(backlogList.children);
console.log(progressList.children);
// Pushes the dropped item (textContent) into the backlogListArray
backlogListArray=[];
for(let i=0;i<backlogList.children.length;i++){
    backlogListArray.push(backlogList.children[i].textContent);
}
// Pushes the dropped item (textContent) into the progressListArray
progressListArray = [];
for(let i=0;i<progressList.children.length;i++){
    progressListArray.push(progressList.children[i].textContent);
}
// Pushes the dropped item (textContent) into the completeListArray
completeListArray =[];
for(let i=0;i<completeList.children.length;i++){
    completeListArray.push(completeList.children[i].textContent);
}
// Pushes the dropped item (textContent) into the onHoldListArray
onHoldListArray =[];
for(let i=0;i<onHoldList.children.length;i++){
    onHoldListArray.push(onHoldList.children[i].textContent);
}

// Update DOM
updateDOM();
}

// When Item Starts Dragging
function drag(e){
draggedItem = e.target;
console.log('draggedItem:',draggedItem);
}
//When item enters column area
function dragEnter(column){
    // console.log(listColumns[column]);
    listColumns[column].classList.add('over');
    currentColumn = column;
} 

// Column allows for item to drop
function allowDrop(e){
    e.preventDefault();
}
// Dropping item in column
function drop(e){
    e.preventDefault();
    // Remove background color/padding when dropped
    listColumns.forEach((column)=>{
        column.classList.remove('over');
    })
    
    // Add item to column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);

    // Rebuild arrays
    rebuildArrays();
}
// On load
updateDOM();
