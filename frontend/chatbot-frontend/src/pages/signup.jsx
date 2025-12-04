import { useState } from "react";
import axios from "axios";
import "./auth.css";

export default function Signup({ onSignedUp }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", name);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("dob", dob);
      if (file) formData.append("profile", file);

      const res = await axios.post(
        "http://127.0.0.1:8000/auth/signup",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess(true);

      setTimeout(() => {
        if (onSignedUp) onSignedUp();
        else window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.detail || "Signup failed");
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
          <div className="app-tagline">Create your account</div>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={(e) => setGender(e.target.value)}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={(e) => setGender(e.target.value)}
                />
                Female
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              className="input"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              className="input-file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {err && <div className="error-msg">{err}</div>}
          {success && (
            <div className="success-msg">Account created! Redirecting...</div>
          )}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <a className="secondary-link" href="/login">
            Already have an account? Log in
          </a>
        </form>
      </div>
    </div>
  );
}
