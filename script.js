let tasks = JSON.parse(localStorage.getItem('kanbanTasks') || '[]');

window.onload = () => {
  renderTasks();
};

function addTask() {
  const title = document.getElementById('taskTitle').value;
  const desc = document.getElementById('taskDesc').value;
  if (!title.trim()) return;

  const newTask = {
    id: Date.now().toString(),
    title,
    description: desc,
    status: 'To Do'
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
}

function renderTasks() {
  document.querySelectorAll('.column').forEach(col => col.innerHTML = `<h2>${col.id}</h2>`);
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;
    div.id = task.id;
    div.ondragstart = drag;

    div.innerHTML = `
      <strong>${task.title}</strong>
      <p>${task.description}</p>
      <button class="edit-btn" onclick="editTask('${task.id}')">Edit</button>
      <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
    `;
    document.getElementById(task.status).appendChild(div);
  });
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt('Edit title:', task.title);
  const newDesc = prompt('Edit description:', task.description);
  if (newTitle !== null) {
    task.title = newTitle;
    task.description = newDesc;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const task = tasks.find(t => t.id === id);
  task.status = ev.currentTarget.id;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}
