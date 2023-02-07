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

    // Create name label for each to-do item
    const todoItemLabel = document.createElement('label');
    todoItemLabel.htmlFor = id;
    todoItemLabel.innerText = name;
    todoItemLabel.classList.add('form-check-label');

    // remove to-do items when double clicked, save status to localStorage
    todoItemElement.ondblclick = function () {
        console.log('double clicked');
        this.remove();
        let index = todoItems.findIndex(item => item.id === id);
        todoItems.splice(index, 1);
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
        todoItemsLeftCount();
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
    todoItemWrapper.appendChild(todoItemLabel);
    todoItemsContainer.appendChild(todoItemElement);
    todoItemsLeftCount();
}

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