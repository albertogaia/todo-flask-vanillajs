document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const tasksList = document.getElementById('tasks-list');

    const deleteTask = (id) => {
        fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
            .then(() => fetchTasks())  // Reloads tasks after deletion
            .catch(error => console.error('Errore:', error));
    };
    
    const createTaskElement = (task) => {
        const li = document.createElement('li');
        // Use a span for the task text to keep the styles separate
        const taskText = document.createElement('span');
        taskText.textContent = task.task;
        if (task.completed){
            li.className = 'completed-li'
            taskText.className = 'completed-text'
        }
        li.appendChild(taskText);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Cancella';
        deleteBtn.onclick = () => deleteTask(task.id);
        li.appendChild(deleteBtn);
        
        // Wrapper for customised checkbox
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'container';

        // Customized checkmark
        const checkMark = document.createElement('span');
        checkMark.className = 'checkmark';

        
        // Create checkbox
        const completedCheckbox = document.createElement('input');
        completedCheckbox.type = 'checkbox';
        completedCheckbox.checked = task.completed;
        completedCheckbox.onchange = () => toggleCompleted(task.id, !task.completed);
        
        checkboxLabel.appendChild(completedCheckbox);
        checkboxLabel.appendChild(checkMark);
        
        // Prepend the label (containing the checkbox) to the list item
        li.prepend(checkboxLabel);
        
        return li;
        
    };
    
    

    // Get tasks
    const fetchTasks = () => {
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(tasks => {
                tasksList.innerHTML = '';
                if(tasks.length < 1){
                    tasksList.innerHTML = '<li>Nessuna task presente, aggiungine una!</li>'
                }
                tasks.forEach(task => {
                    tasksList.appendChild(createTaskElement(task));
                });
            });
    };

    // Toggle Completed Task
    const toggleCompleted = (id, completed) => {
        fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        })
        .then(() => fetchTasks())  // Reload tasks after update
        .catch(error => console.error('Errore:', error));
    };
    

    // ADD new task listener
    form.addEventListener('submit', e => {
        e.preventDefault();
        const task = { task: taskInput.value, completed: false };

        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks(); 
            taskInput.value = '';  // Clear the input
        });
    });

    fetchTasks();  // Load tasks at start-up
});
