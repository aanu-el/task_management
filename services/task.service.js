const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');

async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

exports.createTask = async (title) => {
  const tasks = await readTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    status: 'Pending'
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
};

exports.getAllTasks = async () => {
  return await readTasks();
};

exports.updateTaskStatus = async (id, status) => {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  tasks[taskIndex].status = status;
  await writeTasks(tasks);
  return tasks[taskIndex];
};

exports.deleteTask = async (id) => {
  const tasks = await readTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);

  if (filteredTasks.length === tasks.length) {
    return false;
  }

  await writeTasks(filteredTasks);
  return true;
};
