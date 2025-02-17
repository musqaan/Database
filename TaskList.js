import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';  // Importing the CSS file

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'Pending',
        due_date: ''
    });
    const [editingTaskId, setEditingTaskId] = useState(null);  // To track which task is being edited

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);  // Set the response data to the tasks state
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Load tasks when the component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    // Handle task status update
    const handleStatusChange = async (taskId, status) => {
        try {
            await axios.put(`http://localhost:5000/tasks/${taskId}`, { status });
            fetchTasks();  // Reload tasks after updating the status
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    // Handle adding a new task
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTaskId) {
                // If we're editing a task, update it
                await axios.put(`http://localhost:5000/tasks/${editingTaskId}`, newTask);
                setEditingTaskId(null);  // Reset editing mode
            } else {
                // Add a new task
                await axios.post('http://localhost:5000/tasks', newTask);
            }
            setNewTask({ title: '', description: '', status: 'Pending', due_date: '' });
            fetchTasks();  // Reload tasks after adding or updating a task
        } catch (error) {
            console.error("Error adding or updating task:", error);
        }
    };

    // Handle task deletion
    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${taskId}`);
            fetchTasks();  // Reload tasks after deletion
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Handle editing a task
    const handleEdit = (task) => {
        setNewTask({
            title: task.title,
            description: task.description,
            status: task.status,
            due_date: task.due_date
        });
        setEditingTaskId(task.id);  // Set the ID of the task we're editing
    };

    return (
        <div>
            <h1>Task Calender</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
                <button type="submit">{editingTaskId ? 'Update Task' : 'Add Task'}</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                            <td>{task.due_date}</td>
                            <td>
                                <button onClick={() => handleEdit(task)}>Edit</button>
                                <button className="delete" onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;
