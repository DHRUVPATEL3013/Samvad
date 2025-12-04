// import { useState } from "react";
// import axios from "axios";
// import "./auth.css";

// export default function Login({ onLoggedIn }) {
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr("");
//     try {
//       const res = await axios.post("http://127.0.0.1:8000/auth/login", {
//         phone: phone,
//         // password:password,
//       });
//       // expected: { access_token: "...", token_type: "bearer", user: { email: ... } }
//       const token = res.data.access_token || res.data.token;
//       const userPhone = res.data.user?.phone || phone;
//       localStorage.setItem("token", token);
//       localStorage.setItem("phone", userPhone);
//       if (onLoggedIn) onLoggedIn();
//       else window.location.href = "/chat"; // or route to chat
//     } catch (error) {
//       console.error(error);
//       setErr(error.response?.data?.detail || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h2>Welcome back</h2>
//           <p>Log in to continue to WhatsEase</p>
//         </div>

//         <form onSubmit={submit}>
//           <div className="form-group">
//             <label>Phone</label>
//             <input className="input" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
//           </div>

         
//           {err && <div className="error-msg">{err}</div>}

//           <button className="primary-btn" type="submit" onClick={submit}>Log in</button>

//           <a className="secondary-link" href="/auth/signup">Don't have an account? Sign up</a>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import "./auth.css";

export default function Login({ onLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        phone: phone,
      });
      const token = res.data.access_token || res.data.token;
      const userPhone = res.data.user?.phone || phone;
      localStorage.setItem("token", token);
      localStorage.setItem("phone", userPhone);
      if (onLoggedIn) onLoggedIn();
      else window.location.href = "/chatt";
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="app-brand">
          <div className="app-logo">💬</div>
          <div className="app-name">QuickChat</div>
          <div className="app-tagline">Fast, Secure Messaging</div>
        </div>

        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Log in to continue your conversations</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              className="input" 
              value={phone} 
              onChange={(e)=>setPhone(e.target.value)} 
              placeholder="Enter your phone number"
              required 
              disabled={loading}
            />
          </div>

          {err && <div className="error-msg">{err}</div>}

          <button 
            className={`primary-btn ${loading ? 'loading' : ''}`} 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <a className="secondary-link" href="/signup">
            Don't have an account? Sign up
          </a>
        </form>
      </div>
    </div>
  );
}