import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email: email,
        password: password,
      });

      // ✅ Save token and email
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("email", res.data.email);

      navigate("/chat");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert("Invalid credentials");
      } else if (err.response && err.response.status === 422) {
        alert("Invalid request format. Fill email and password correctly.");
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
