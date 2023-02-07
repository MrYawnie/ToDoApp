const todoItemsContainer = document.getElementById('todo-items-container');
const todoItemForm = document.getElementById('form-todo-items');
const todoItemInput = todoItemForm['todo-item'];

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

    // Toggle to-do items when clicked, save status to localStorage
    todoItemElement.onclick = function () {
        this.classList.toggle("active");
        todoItems.forEach(item => { if (item.id === id) item.complete = !item.complete });
        localStorage.setItem('todoItems', JSON.stringify(todoItems));
    }
    
    // Append to-do items to the DOM
    todoItemElement.appendChild(todoItemWrapper);
    todoItemWrapper.appendChild(todoItemLabel);
    todoItemsContainer.appendChild(todoItemElement);
   
}

todoItems.forEach(createToDoElement);

// Add new item to to-do list
todoItemForm.onsubmit = (e) => {
    e.preventDefault();
    
    if (todoItemInput.value === '') return;
    
    const newItem = addItem(
        todoItemInput.value,
        randomId()
    );

    createToDoElement(newItem);

    todoItemForm.reset();
}