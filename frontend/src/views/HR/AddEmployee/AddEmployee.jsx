import React, { useState } from 'react';
import api from '../../../services/Api';
import DateDisplay from '../../../components/common/DateDisplay/DateDisplay';
import './AddEmployee.css';

const AddEmployee = () => {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phoneNb: '',
        account_type: 'employee',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/v0.1/admin/addOrUpdateUser/add', formData);
            if (response.data.success) {
                console.log('Employee added successfully!');
            } else {
                setError('Failed to add employee.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div>
            <div className="employee-r-header">
        <div>
          <h1 className="employee-r-title">Add Employee</h1>
        </div>
        <DateDisplay date={formattedDate} className="header-date" />
      </div>
      <div className="employee-form-container1">
            <h2>Add New Employee</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    First Name:
                    <input 
                        type="text" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Last Name:
                    <input 
                        type="text" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <label>
                    Phone Number:
                    <input 
                        type="text" 
                        name="phoneNb" 
                        value={formData.phoneNb} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Account Type:
                    <select 
                        name="account_type" 
                        value={formData.account_type} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="employee">Employee</option>
                        <option value="hr">HR</option>
                        <option value="manager">Manager</option>
                    </select>
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    );
};

export default AddEmployee;
