const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

function addTask() {
   const taskText = taskInput.value.trim();
   if (taskText !== '') {
    u
      const taskItem = document.createElement('li');
      taskItem.textContent = taskText;
      taskList.appendChild(taskItem);

      const deleteButton = createButton('Delete', function() {
     
         taskList.removeChild(taskItem);
      });
      taskItem.appendChild(deleteButton);

      const editButton = createButton('Edit', function() {
         const updatedText = prompt('Edit task:', taskText);
         if (updatedText !== null) {
            taskItem.textContent = updatedText;
         }
      });
      taskItem.appendChild(editButton);

      taskInput.value = '';
   }
}

function createButton(text, clickHandler) {
   const button = document.createElement('button');
   button.textContent = text;
   button.addEventListener('click', clickHandler);
   button.classList.add('ml-2', 'bg-blue-500', 'text-white', 'p-2');
   return button;
}
