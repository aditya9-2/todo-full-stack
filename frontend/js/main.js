
const toggleTodoPage = (e) => {

    e.preventDefault();
    const userName = document.querySelector('input').value;
    localStorage.setItem('userName', userName);
    window.location.href = 'todo.html';

}

document.querySelector('.input-box').addEventListener('submit', toggleTodoPage);

