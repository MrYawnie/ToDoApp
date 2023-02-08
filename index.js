const todoItemsContainer = document.getElementById('todo-items-container');
const todoItemForm = document.getElementById('form-todo-items');
const todoItemInput = todoItemForm['todo-item'];
const incorrectEntry = document.getElementById('incorrect-entry');


const randomId = () => Math.floor(Math.random() * 100000000);

const todoItems = JSON.parse(localStorage.getItem('todoItems')) || [];

const addItem = (name, id) => {
    todoItems.push({
        name: name,
        id: id,
        complete: false
    });

    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    return { name, id };
}

const todoItemsLeftCount = () => {
    const todoItemsLeft = todoItems.filter(item => !item.complete).length;
    const todoItemsLeftSpan = document.getElementById('todo-items-count');
    todoItemsLeftSpan.innerText = todoItemsLeft;
}

const createToDoElement = ({ name, id, complete }) => {
        
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
    todoItemRemoveButton.onclick = function () {
        console.log('clicked');
        this.parentElement.parentElement.remove();
        let index = todoItems.findIndex(item => item.id === id);
        todoItems.splice(index, 1);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        todoItemsLeftCount();
    }


    // remove to-do items when double clicked, save status to localStorage
    todoItemElement.ondblclick = function () {
        console.log('double clicked');
        this.remove();
        let index = todoItems.findIndex(item => item.id === id);
        todoItems.splice(index, 1);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        todoItemsLeftCount();
    }

    // show remove button when mouse over to-do items
    todoItemElement.onmouseover = function () {
        console.log('mouse over');
        todoItemRemoveButton.style.display = 'inline-block';
    }

    // hide remove button when mouse out to-do items
    todoItemElement.onmouseout = function () {
        console.log('mouse out');
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

// Iterate through and draw all todo-items from localstorage to the DOM
todoItems.forEach(createToDoElement);

// Add new item to to-do list
todoItemForm.onsubmit = (e) => {
    e.preventDefault();
    
    if (todoItemInput.value === '' || todoItemInput.value.length < 3) {
        incorrectEntry.innerText = ' * Please enter a valid to-do item (over 2 char)';
        todoItemInput.style.border = '3px solid red';
        return;
    }
    incorrectEntry.innerText = '';
    todoItemInput.style.border = '';
    const newItem = addItem(
        todoItemInput.value,
        randomId()
    );

    createToDoElement(newItem);

    todoItemForm.reset();
}