import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const TicketEdit = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Open");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/tickets/${id}`).then((response) => {
      const { subject, description, status } = response.data;
      setSubject(subject);
      setDescription(description);
      setStatus(status);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/tickets/${id}`, { subject, description, status });
    navigate("/"); // Redirect after update
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3">✏️ Edit Ticket</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select
          className="form-select mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
        <button className="btn btn-warning w-100">Update Ticket</button>
      </form>
    </div>
  );
};

export default TicketEdit;
