
import React, { useState } from 'react';
import './KanbanBoard.css'; 
import TaskItem from './TaskItem'; // Import du composant TaskItem

function TaskApp() {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [showForm, setShowForm] = useState(false);
  const [taskData, setTaskData] = useState({ name: '', description: '', status: 'todo' });

  const openForm = () => setShowForm(true);
  const closeForm = () => {
    setShowForm(false);
    setTaskData({ name: '', description: '', status: 'todo' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const saveTask = () => {
    const { name, description, status } = taskData;

    if (name && description) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: [...prevTasks[status], { name, description }]
      }));
      closeForm();
    } else {
      alert("Tous les champs sont requis!");
    }
  };

  // Fonction de démarrage du drag (dragStart)
  const handleDragStart = (e, task, currentStatus) => {
    e.dataTransfer.setData('task', JSON.stringify({ task, currentStatus }));
  };

  // Fonction pour permettre le drag-over
  const handleDragOver = (e) => {
    e.preventDefault(); // Permettre le drop
  };

  // Fonction pour gérer le drop (déplacement de tâche)
  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('task');
    const { task, currentStatus } = JSON.parse(data);

    if (currentStatus !== newStatus) {
      // Copie des tâches actuelles pour ne pas modifier directement l'état
      const updatedTasks = { ...tasks };

      // Retirer la tâche de la colonne d'origine
      updatedTasks[currentStatus] = updatedTasks[currentStatus].filter(
        (t) => t.name !== task.name
      );

      // Ajouter la tâche à la nouvelle colonne
      updatedTasks[newStatus] = [...updatedTasks[newStatus], task];

      // Mettre à jour l'état avec les nouvelles listes de tâches
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="kanban-container">
      <button className="add-task-button" onClick={openForm}>Create new task</button>

      {showForm && (
        <div className="form-container">
          <h3>New task</h3>
          <input
            type="text"
            name="name"
            placeholder="Nom de la tâche"
            value={taskData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={taskData.description}
            onChange={handleChange}
          />
          <select name="status" value={taskData.status} onChange={handleChange}>
            <option value="todo">TO DO</option>
            <option value="inProgress">in progress</option>
            <option value="done">DONE</option>
          </select>
          <button className="save-button" onClick={saveTask}>Sauvegarder</button>
          <button className="cancel-button" onClick={closeForm}>Annuler</button>
        </div>
      )}

      <div className="kanban-board">
        {/* TO DO */}
        <div
          className="kanban-column todo"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'todo')}
        >
          <h3>TO DO</h3>
          {tasks.todo.map((task, index) => (
            <div
              key={index}
              className="task-item"
              draggable
              onDragStart={(e) => handleDragStart(e, task, 'todo')}
            >
              <TaskItem task={task} />
            </div>
          ))}
        </div>

        {/* IN PROGRESS */}
        <div
          className="kanban-column inProgress"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'inProgress')}
        >
          <h3>In Progress</h3>
          {tasks.inProgress.map((task, index) => (
            <div
              key={index}
              className="task-item"
              draggable
              onDragStart={(e) => handleDragStart(e, task, 'inProgress')}
            >
              <TaskItem task={task} />
            </div>
          ))}
        </div>

        {/* DONE */}
        <div
          className="kanban-column done"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'done')}
        >
          <h3>DONE</h3>
          {tasks.done.map((task, index) => (
            <div
              key={index}
              className="task-item"
              draggable
              onDragStart={(e) => handleDragStart(e, task, 'done')}
            >
              <TaskItem task={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskApp;

