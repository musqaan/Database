import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const response = await axios.get("http://localhost:5000/tickets");
    setTickets(response.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      await axios.delete(`http://localhost:5000/tickets/${id}`);
      fetchTickets();
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h2 className="mb-4">📋 All Support Tickets</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.description}</td>
              <td>{ticket.status}</td>
              <td>
                <Link to={`/edit/${ticket.id}`} className="btn btn-primary btn-sm me-2">
                  ✏️ Edit
                </Link>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleDelete(ticket.id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
