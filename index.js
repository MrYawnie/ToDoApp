// Import elements from HTML
const todoItemsContainer = document.getElementById('todo-items-container');
const todoItemForm = document.getElementById('form-todo-items');
const todoItemInput = todoItemForm['todo-item'];

const todoListsContainer = document.getElementById('todo-lists-container');
const todoListForm = document.getElementById('form-todo-lists');
const todoListInput = todoListForm['todo-list'];

const selectedList = document.getElementById('selected-list');

// Toggle button to hide the sidepanel on mobile view
const hideElement = () => {
    const element = document.getElementById('list-section-container');
    const toggleBtnIcon = document.getElementById('toggle-button-icon')
    element.classList.toggle('mobile-hide');
    toggleBtnIcon.classList.toggle('bi-x');
    toggleBtnIcon.classList.toggle('bi-list');
}

// Get random Id for both todo items and todo lists
const randomId = () => Math.floor(Math.random() * 100000000);

// Get todo items and todo lists from localStorage, or create default tutorial items if none exist
const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [{
    name: 'Click to toggle between complete / uncomplete',
    id: randomId(),
    listId: 123456789,
    complete: true
}, {
    name: 'Hover over to reveal the remove button...',
    id: randomId(),
    listId: 123456789,
    complete: false
}, {
    name: '... or simply double click to remove an item!',
    id: randomId(),
    listId: 123456789,
    complete: false
}, {
    name: 'Add more lists on the sidepanel ↖',
    id: randomId(),
    listId: 123456789,
    complete: false
}, {
    name: '... to reveal selected list\'s to-do items...',
    id: randomId(),
    listId: 987654321,
    complete: false
}, {
    name: '... all of which are saved to localStorage!',
    id: randomId(),
    listId: 987654321,
    complete: false
}, {
    name: 'And don\'t forget to use the filters above! ⬆ ',
    id: randomId(),
    listId: 987654321,
    complete: false
}, {
    name: 'You may collapse the sidepanel by clicking the toggle button ⬆',
    id: randomId(),
    listId: 123454321,
    complete: false
}
, {
    name: 'The collapse feature is only available on mobile view.',
    id: randomId(),
    listId: 123454321,
    complete: false
}
];
const todoLists = JSON.parse(localStorage.getItem('todoLists')) || [{
    name: 'Tutorial',
    id: 123456789
}, {
    name: 'Click to open secondary lists',
    id: 987654321
}, {
    name: 'Introducing mobile view!',
    id: 123454321
}
];

// active list
const activeList = () => {
    const checkedList = document.querySelector('input[name = "list-item-radio"]:checked') || todoLists[0];
    if (checkedList === undefined) {
        todoItemInput.style.border = '3px solid red';
        todoItemInput.placeholder = 'Add a list first!';
        todoItemInput.value = '';
        throw new Error('No list selected'); // this is to throw a custom error message to console log, if no list is selected
    } else {
        return parseInt(checkedList.id);
    }
}

// Name of active list, to show on the top of the to-do list
const activeListName = () => {
    // find selected list element
    const checkedList = document.querySelector('input[name = "list-item-radio"]:checked') || todoLists[0];
    // get list name from localstorage, matching the checked list id
    const listName = todoLists.find(list => list.id === parseInt(checkedList.id)).name;
    return listName;
   
}

// Save to-do items to localStorage
const addItem = (name, id, listId) => {
    todoItems.push({
        name: name,
        id: id,
        listId: listId,
        complete: false
    });

    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    return { name, id, listId };
}

// Save todo lists to localStorage
const addList = (name, id) => {
    todoLists.push({
        name: name,
        id: id
    });

    localStorage.setItem('todoLists', JSON.stringify(todoLists));

    return { name, id };
}

// Count to-do items left
const todoItemsLeftCount = () => {
    const todoItemsLeft = todoItems.filter(item => !item.complete && item.listId === activeList()).length;
    const todoItemsLeftSpan = document.getElementById('todo-items-count');
    todoItemsLeftSpan.innerText = todoItemsLeft;
}

// Create to-do items for selected list
const createToDoElement = ({ name, id, listId, complete }) => {

    // Create li-element for each to-do item
    const todoItemElement = document.createElement('li');
    todoItemElement.classList.add('list-group-item');
    todoItemElement.classList.add('list-group-item-action');
    if (complete) {
        todoItemElement.classList.add('active');
    }

    // Create div-wrapper for each to-do item
    const todoItemWrapper = document.createElement('div');
    todoItemWrapper.classList.add('form-check');
    todoItemWrapper.classList.add('d-flex');
    todoItemWrapper.classList.add('justify-content-between');

    // Create name label for each to-do item
    const todoItemLabel = document.createElement('label');
    todoItemLabel.htmlFor = id;
    todoItemLabel.innerText = name;
    todoItemLabel.classList.add('form-check-label');

    // Create remove button for each to-do item
    const todoItemRemoveButton = document.createElement('button');
    todoItemRemoveButton.classList.add('btn');
    todoItemRemoveButton.classList.add('btn-danger');
    todoItemRemoveButton.classList.add('btn-sm');
    todoItemRemoveButton.classList.add('float-right');
    todoItemRemoveButton.classList.add('remove');
    todoItemRemoveButton.innerText = 'Remove';
    todoItemRemoveButton.style.display = 'none';
    
    // Create remove functionality for remove button
    todoItemRemoveButton.onclick = function () {
        this.parentElement.parentElement.remove();
        let index = todoItems.findIndex(item => item.id === id);
        todoItems.splice(index, 1);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        todoItemsLeftCount();
    }


    // remove to-do items when double clicked, save status to localStorage
    todoItemElement.ondblclick = function () {
        this.remove();
        let index = todoItems.findIndex(item => item.id === id);
        todoItems.splice(index, 1);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        todoItemsLeftCount();
    }

    // show remove button when mouse over to-do items
    todoItemElement.onmouseover = function () {
        todoItemRemoveButton.style.display = 'inline-block';
    }

    // hide remove button when mouse out to-do items
    todoItemElement.onmouseout = function () {
        todoItemRemoveButton.style.display = 'none';
    }

    // Toggle to-do items when clicked, save status to localStorage
    todoItemElement.onclick = function () {
        console.log('clicked');
        this.classList.toggle("active");
        todoItems.forEach(item => { if (item.id === id) item.complete = !item.complete });
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        todoItemsLeftCount();
    }

    // Append to-do items to the DOM
    todoItemElement.appendChild(todoItemWrapper);
    todoItemWrapper.append(todoItemLabel, todoItemRemoveButton);
    todoItemsContainer.appendChild(todoItemElement);
    todoItemsLeftCount();
}

// Create list items
const createToDoListElement = ({ name, id }) => {
    // Create li-element for each list item
    const todoListElement = document.createElement('li');
    todoListElement.classList.add('list-group-item');
    todoListElement.classList.add('list-group-item-action');

    // Create div-wrapper for each list item
    const todoListWrapper = document.createElement('div');
    todoListWrapper.classList.add('form-check');
    todoListWrapper.classList.add('d-flex');
    todoListWrapper.classList.add('justify-content-between');

    // Create radio input for each list item
    const todoListRadio = document.createElement('input');
    todoListRadio.type = 'radio';
    todoListRadio.name = 'list-item-radio';
    todoListRadio.id = id;
    todoListRadio.classList.add('form-check-input');
    let i = todoLists.findIndex(list => list.id === id);
    if (i === 0) {
        todoListRadio.setAttribute('checked', 'checked'); 
    }
    todoListRadio.classList.add('visually-hidden');
    
    // Create name label for each list item
    const todoListLabel = document.createElement('label');
    todoListLabel.htmlFor = id;
    todoListLabel.innerText = name;
    todoListLabel.classList.add('form-check-label');
    todoListLabel.classList.add('list-group-label');

    // Create remove button for each list item
    const todoListRemoveButton = document.createElement('button');
    todoListRemoveButton.classList.add('btn');
    todoListRemoveButton.classList.add('btn-danger');
    todoListRemoveButton.classList.add('btn-sm');
    todoListRemoveButton.classList.add('float-right');
    todoListRemoveButton.classList.add('remove');
    todoListRemoveButton.innerText = 'Remove';
    todoListRemoveButton.style.display = 'none';

    // remove lists when remove button is clicked
    todoListRemoveButton.onclick = function () {
        removeList();
        drawTodoItems();
    }

    // remove to-do items when double clicked, save status to localStorage
    todoListElement.ondblclick = function () {
        removeList();
        drawTodoItems();
    }

    // show remove button when mouse over to-do items
    todoListElement.onmouseover = function () {
        todoListRemoveButton.style.display = 'inline-block';
    }

    // hide remove button when mouse out to-do items
    todoListElement.onmouseout = function () {
        todoListRemoveButton.style.display = 'none';
    }

    // Append to-do items to the DOM
    todoListElement.appendChild(todoListWrapper);
    todoListWrapper.append(todoListRadio, todoListLabel, todoListRemoveButton);
    todoListsContainer.appendChild(todoListElement);

    // reusable remove list function, called by double clicking list element or pressing remove button
    const removeList = () => {
        todoListElement.remove();
        let index = todoLists.findIndex(item => item.id === id);
        todoLists.splice(index, 1);
        localStorage.setItem('todoLists', JSON.stringify(todoLists));

        // also delete all deleted list items from localStorage
        let listItems = JSON.parse(localStorage.getItem('todoItems'));
        let listItemsFiltered = listItems.filter(item => item.listId !== id);
        localStorage.setItem('todoItems', JSON.stringify(listItemsFiltered));
    }
}

// Add new item to to-do list
todoItemForm.onsubmit = (e) => {
    e.preventDefault();

    if (todoItemInput.value === '' || todoItemInput.value.length < 3) {
        todoItemInput.style.border = '3px solid red';
        todoItemInput.placeholder = 'Minimum 3 characters!';
        todoItemInput.value = '';
        return;
    }
    todoItemInput.style.border = '';
    todoItemInput.placeholder = 'Add ToDo Item';

    const newItem = addItem(
        todoItemInput.value,
        randomId(),
        activeList()
    );

    createToDoElement(newItem);

    todoItemForm.reset();
}

// Add new list
todoListForm.onsubmit = (e) => {
    e.preventDefault();

    if (todoListInput.value === '' || todoListInput.value.length < 3) {
        todoListInput.style.border = '3px solid red';
        todoListInput.placeholder = 'Minimum 3 characters!';
        todoListInput.value = '';
        return;
    }

    todoListInput.style.border = '';
    todoListInput.placeholder = 'Add ToDo List';

    const newList = addList(
        todoListInput.value,
        randomId()
    );

    createToDoListElement(newList);

    todoListForm.reset();
}

// Draw todo items on screen
const drawTodoItems = () => {
    const drawActiveTasks = document.getElementById('filter-active-tasks').checked;
    const drawCompletedTasks = document.getElementById('filter-completed-tasks').checked;
    selectedList.innerText = activeListName();

    todoItemsContainer.innerHTML = ''; // empty the list before drawing again

    if (drawActiveTasks) { // filter and draw only the active tasks
        todoItems.forEach(item => { if (!item.complete && item.listId === activeList()) createToDoElement(item) });
    } else if (drawCompletedTasks) { // filter and draw only the completed tasks
        todoItems.forEach(item => { if (item.complete && item.listId === activeList()) createToDoElement(item) });
    } else { // draw all tasks in the selected list
        todoItems.forEach(item => { if (item.listId === activeList()) createToDoElement(item) }); // only draw selected list items
    }
}

const drawTodoListItems = () => {
    todoLists.forEach(createToDoListElement); // draw all items (default)
}

// Start the app, draw selected to-do items
drawTodoItems();
drawTodoListItems();