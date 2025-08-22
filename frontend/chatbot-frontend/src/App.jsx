import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="auth/signup" element={<Signup/>} />
        <Route path="auth/login" element={<Login/>} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </Router>
  );
}

export default App;
