document.addEventListener('DOMContentLoaded', function() {
    loadListData(); // Load list data when the page loads

    document.getElementById('add-task').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        addTask(); // Call the addTask function to add the task
    });

    document.getElementById('new-task').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            addTask(); // Call the addTask function to add the task
        }
    });

    document.getElementById('sort-tasks').addEventListener('change', function() {
        sortTasks();
        saveListData();
    });

    document.getElementById('delete-completed').addEventListener('click', function() {
        const taskList = document.getElementById('task-list');
        const completedTasks = taskList.querySelectorAll('.completed');
        completedTasks.forEach(task => {
            taskList.removeChild(task);
        });
        saveListData();
        updateTaskVisibility();
    });

    function addTask() {
        const taskInput = document.getElementById('new-task');
        const taskDateInput = document.getElementById('task-date');
        const taskText = taskInput.value.trim();
        let taskDate = taskDateInput.value;

        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        if (taskDate === '') {
            const today = new Date();
            taskDate = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        }

        const taskList = document.getElementById('task-list');
        const li = document.createElement('li');

        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = taskText;
        taskTextElement.classList.add('task-text');

        const taskDateElement = document.createElement('span');
        const dateObj = new Date(taskDate);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        taskDateElement.textContent = formattedDate;
        taskDateElement.classList.add('task-date');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(li);
            saveListData();
            updateTaskVisibility();
        });

        li.appendChild(taskTextElement);
        li.appendChild(taskDateElement);
        li.appendChild(deleteButton);
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveListData();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        taskDateInput.value = '';
        saveListData();
        updateTaskVisibility();
    }

    function saveListData() {
        const taskList = document.getElementById('task-list');
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('.task-text').textContent,
            date: li.querySelector('.task-date').textContent,
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadListData() {
        const taskList = document.getElementById('task-list');
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            taskList.innerHTML = '';
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(task => {
                const li = document.createElement('li');

                const taskTextElement = document.createElement('span');
                taskTextElement.textContent = task.text;
                taskTextElement.classList.add('task-text');

                const taskDateElement = document.createElement('span');
                taskDateElement.textContent = task.date;
                taskDateElement.classList.add('task-date');

                if (task.completed) {
                    li.classList.add('completed');
                }

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    taskList.removeChild(li);
                    saveListData();
                    updateTaskVisibility();
                });

                li.appendChild(taskTextElement);
                li.appendChild(taskDateElement);
                li.appendChild(deleteButton);
                li.addEventListener('click', () => {
                    li.classList.toggle('completed');
                    saveListData();
                });
                taskList.appendChild(li);
            });
            updateTaskVisibility();
            sortTasks(); // Sort tasks after loading
        }
    }

    function updateTaskVisibility() {
        const taskList = document.getElementById('task-list');
        const tasks = taskList.children;
        const toggleButton = document.getElementById('toggle-tasks');
        const maxVisibleTasks = 3;

        for (let i = 0; i < tasks.length; i++) {
            if (i < maxVisibleTasks) {
                tasks[i].style.display = 'flex';
            } else {
                tasks[i].style.display = 'none';
            }
        }

        if (tasks.length > maxVisibleTasks) {
            toggleButton.style.display = 'block';
            toggleButton.textContent = 'Show More';
            toggleButton.onclick = function() {
                if (toggleButton.textContent === 'Show More') {
                    for (let i = maxVisibleTasks; i < tasks.length; i++) {
                        tasks[i].style.display = 'flex';
                    }
                    toggleButton.textContent = 'Show Less';
                } else {
                    for (let i = maxVisibleTasks; i < tasks.length; i++) {
                        tasks[i].style.display = 'none';
                    }
                    toggleButton.textContent = 'Show More';
                }
            };
        } else {
            toggleButton.style.display = 'none';
        }
    }

    function sortTasks() {
        const taskList = document.getElementById('task-list');
        const tasks = Array.from(taskList.children);

        const sortOrder = document.getElementById('sort-tasks').value;
        tasks.sort((a, b) => {
            const dateA = new Date(a.querySelector('.task-date').textContent);
            const dateB = new Date(b.querySelector('.task-date').textContent);
            return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
        });

        // Remove all tasks and re-add them in the sorted order
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        tasks.forEach(task => taskList.appendChild(task));

        updateTaskVisibility();
    }
});
