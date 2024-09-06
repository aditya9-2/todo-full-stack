const BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission to save the username and redirect
    const form = document.querySelector('.input-box form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const userName = document.querySelector('.input-box input').value;
            localStorage.setItem('userName', userName);
            console.log(`username: ${userName}`);

            window.location.href = 'todo.html';
        });
    }

    // Display the username on the todo page
    const storedUserName = localStorage.getItem('userName') || 'User';
    const showUserName = document.querySelector('#userName');
    if (showUserName) {
        showUserName.textContent = storedUserName;
    }

    fetchTodos();

    const addButton = document.querySelector('#btn');
    const inputField = document.querySelector('#inp');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    document.querySelector('.errD').appendChild(errorDiv);


    if (addButton && inputField) {
        addButton.addEventListener('click', () => {
            const task = inputField.value.trim();
            if (!task) {
                errorDiv.textContent = 'Cannot add empty todo';
                errorDiv.style.display = 'block';
                setTimeout(() => errorDiv.style.display = 'none', 1500);
                return;
            }

            addTodo({
                task,
                completed: false
            });
            inputField.value = '';
        });
    }


    document.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const todoId = event.target.closest('.list').querySelector('#editBtn').dataset.id;
            const completed = event.target.checked;

            updateTodoCompletion(todoId, completed);
        }
    });


    document.addEventListener('click', (event) => {
        const editBtn = event.target.closest('#editBtn');
        if (editBtn) {
            const todoId = editBtn.dataset.id;
            startEditing(todoId);
        }

        const deleteBtn = event.target.closest('#deleteBtn');
        if (deleteBtn) {
            const todoId = deleteBtn.dataset.id;
            deleteTodo(todoId);
        }
    });
});

const fetchTodos = () => {
    fetch(`${BASE_URL}/todos`)
        .then(response => response.json())
        .then(todos => {
            const todoContainer = document.querySelector('.added-lists');
            const countSpan = document.querySelector('.count');
            if (todoContainer && countSpan) {
                todoContainer.innerHTML = '';

                if (todos.length === 0) {
                    countSpan.textContent = '0';
                    countSpan.style.color = 'darkred';
                } else {
                    countSpan.textContent = todos.length;
                    countSpan.style.color = 'green';
                }

                todos.forEach(todo => {
                    const todoElement = document.createElement('div');
                    todoElement.className = 'list';
                    todoElement.innerHTML = `
                        <input type="checkbox" id="chk" ${todo.completed ? 'checked' : ''}>
                        <p style="${todo.completed ? 'text-decoration: line-through;' : ''}" class="todo-text">${todo.task}</p>
                        <div class="actions">
                            <button id="editBtn" data-id="${todo.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button id="deleteBtn" data-id="${todo.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    todoContainer.appendChild(todoElement);
                });
            } else {
                console.error('Todo container or count span not found');
            }
        })
        .catch(error => console.error('Error fetching todos:', error));
};

const addTodo = (todo) => {
    fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    })
        .then(response => response.json())
        .then(result => {
            fetchTodos(); // Refresh the todo list
        })
        .catch(error => console.error('Error adding todo:', error));
};

const editTodo = (id, updatedData) => {
    fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
        .then(response => response.json())
        .then(result => {
            fetchTodos(); // Refresh the todo list
        })
        .catch(error => console.error('Error updating todo:', error));
};

const deleteTodo = (id) => {
    fetch(`${BASE_URL}/todos/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(result => {
            fetchTodos(); // Refresh the todo list
        })
        .catch(error => console.error('Error deleting todo:', error));
};

const updateTodoCompletion = (id, completed) => {
    fetch(`${BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
    })
        .then(response => response.json())
        .then(result => {
            fetchTodos(); // Refresh the todo list
        })
        .catch(error => console.error('Error updating todo completion:', error));
};

// Function to start inline editing
const startEditing = (id) => {
    const todoElement = document.querySelector(`.list #editBtn[data-id="${id}"]`).closest('.list');
    const textElement = todoElement.querySelector('.todo-text');
    const currentText = textElement.textContent;

    // Create and show the input field and save button
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.className = 'edit-input';

    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fas fa-check"></i>';
    saveButton.className = 'save-btn';

    todoElement.innerHTML = '';
    todoElement.appendChild(editInput);
    todoElement.appendChild(saveButton);

    // Handle save button click
    saveButton.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText) {
            editTodo(id, { task: newText });
        }
    });

    // Optional: Handle pressing 'Enter' key in input field to save
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveButton.click();
        }
    });
};
