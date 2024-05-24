// Initialize taskList after DOM content is fully loaded
window.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('task-list'); // Assign the value of taskList
    loadListData(); // Load list data when the page loads
});

// Add event listener to the "Add Task" button to add the task
document.getElementById('add-task').addEventListener('click', addTask);

// Add event listener for the "Enter" key press in the input field to add the task
document.getElementById('new-task').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        return; // Do nothing if taskText is empty
    }

    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(li);
        saveListData(); // Save list data after deleting a task
    });

    li.appendChild(deleteButton);
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveListData(); // Save list data after marking a task as completed
    });

    taskList.appendChild(li);
    taskInput.value = '';

    saveListData(); // Save list data after adding a task
}

// Function to save the list data to localStorage
function saveListData() {
    const taskList = document.getElementById('task-list');
    const tasks = Array.from(taskList.children).map(li => ({
        text: li.textContent.replace('Delete', '').trim(), // Exclude delete button text
        completed: li.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Function to load the list data from localStorage
function loadListData() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const taskList = document.getElementById('task-list');
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add('completed');
            }
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                taskList.removeChild(li);
                saveListData(); // Save list data after deleting a task
            });
            li.appendChild(deleteButton);
            li.addEventListener('click', () => {
                li.classList.toggle('completed');
                saveListData(); // Save list data after marking a task as completed
            });
            taskList.appendChild(li);
        });
    }
}
