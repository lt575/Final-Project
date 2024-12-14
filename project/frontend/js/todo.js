const todos = [];
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const addTodoButton = document.getElementById('addTodoButton');

function renderTodos() {
    todoList.innerHTML = ''; 
    todos.forEach((todo, index) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onchange = function() {
            todo.completed = checkbox.checked; 
            renderTodos(); 
        };

        const taskText = document.createElement('span');
        taskText.textContent = todo.text;
        if (todo.completed) {
            taskText.classList.add('completed'); 
        }

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';
        editButton.onclick = function() {
            const newText = prompt("Edit your task:", todo.text);
            if (newText !== null && newText.trim() !== "") {
                todo.text = newText; 
                renderTodos(); 
            }
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.onclick = function() {
            todos.splice(index, 1); 
            renderTodos(); 
        };

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}

addTodoButton.addEventListener('click', function() {
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
        todos.push({ text: todoText, completed: false }); 
        todoInput.value = ''; 
        renderTodos(); 
    }
});

renderTodos();
