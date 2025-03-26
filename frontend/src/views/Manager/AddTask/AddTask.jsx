import React, { useState, useEffect } from 'react';
import api from '../../../services/Api';
import './AddTask.css';

const TaskForm = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        due_date: '',
        status: 'not_started'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/v0.1/user/getusers/15/1');
            setUsers(response.data.users.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/v0.1/user/add_update_task/add', formData);
            console.log(response.data);
            alert('Task added/updated successfully!');
        } catch (error) {
            console.error('Error adding/updating task:', error);
            alert('Failed to add/update the task.');
        }
    };

    return (
        <div className="task-form-container">
        <form onSubmit={handleSubmit}>
            <label>
                Task Title:
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </label>
            <label>
                Description:
                <textarea name="description" value={formData.description} onChange={handleChange} required />
            </label>
            <label>
                Assign To:
                <select name="assigned_to" value={formData.assigned_to} onChange={handleChange} required>
                    <option value="">Select a user</option>
                    {users?.length>0 && users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.first_name} ({user.email})
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Due Date:
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} required />
            </label>
            <label>
                Status:
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </label>
            <button type="submit">Submit</button>
        </form>
        </div>
    );
};

export default TaskForm;