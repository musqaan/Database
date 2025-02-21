import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TicketForm = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/tickets", { subject, description });
    navigate("/"); // Redirect after creation
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3">📝 Create New Ticket</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className="btn btn-success w-100">Submit Ticket</button>
      </form>
    </div>
  );
};

export default TicketForm;
