import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Chat from "./pages/chat";
import "./App.css"
function App() {
  return (
    <Router>
    
       <div className="navbar">
  <Link to="/auth/signup">Signup</Link>
  <Link to="/auth/login">Login</Link>
  <Link to="/chat">Chat</Link>
</div>

      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
