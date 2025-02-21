import React from "react";
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";
import TicketEdit from "./components/TicketEdit";


function App() {
  return (
    <Router>
      <div className="container py-4">
        <h1 className="text-center mb-4">🎟️ Customer Support Ticket System</h1>
        <nav className="mb-4">
          <Link to="/" className="btn btn-primary me-2">
            Ticket List
          </Link>
          <Link to="/new" className="btn btn-success">
            + Create New Ticket
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<TicketList />} />
          <Route path="/new" element={<TicketForm />} />
          <Route path="/edit/:id" element={<TicketEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
