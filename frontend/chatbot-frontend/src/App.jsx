import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Chatt from "./pages/chatt";
import "./App.css"
import Profile from "./pages/profile";
import Home from "./Home";
function App() {
  return (
//     <Router>
    
//        <div>
//         <Link to="/auth/signup">Signup</Link>

// </div>

//       <Routes>
//         
//       </Routes>
//     </Router>

<Router>

<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

         <Route path="/chat" element={<Chat />} />
        <Route path="/chatt" element={<Chatt />}/>
       <Route path="/profile" element={<Profile/>}/>
</Routes>
</Router>


  );
}

export default App;
