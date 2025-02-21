import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Make sure this path is correct relative to your component file


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', position: '', salary: '' });

  useEffect(() => {
    // Fetch all employees
    axios.get('http://localhost:5000/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/employees', newEmployee)
      .then(res => {
        setEmployees([...employees, res.data]);
        setNewEmployee({ name: '', email: '', position: '', salary: '' });
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(() => setEmployees(employees.filter(emp => emp.id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Employee Management</h1>

      {/* Add New Employee Form */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={newEmployee.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={newEmployee.email} onChange={handleChange} required />
        <input type="text" name="position" placeholder="Position" value={newEmployee.position} onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salary" value={newEmployee.salary} onChange={handleChange} required />
        <button type="submit">Add Employee</button>
      </form>

      {/* Employee List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.salary}</td>
              <td>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
