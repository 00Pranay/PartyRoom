import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

export default function LoginRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "register"
  const navigate = useNavigate();

  const submit = async () => {
    if (!username || !password) return alert("Enter username and password");

    try {
      const res = await fetch(`http://localhost:8080/api/users/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        alert(text);
        return;
      }

      localStorage.setItem("fileUser", username);
      navigate("/Dashboard");
    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }
  };

 return (
  <>
    <Navbar />

    <div style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.heading}>
          {mode === "login" ? "Welcome Back 👋" : "Join FileShare 🚀"}
        </h1>

        <p style={styles.subheading}>
          {mode === "login"
            ? "Login to upload, preview, share and manage your files securely."
            : "Create an account to start uploading and sharing files instantly."}
        </p>

        <div style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button onClick={submit} style={styles.primaryButton}>
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>

        <div style={styles.footer}>
          <span style={styles.footerText}>
            {mode === "login"
              ? "New here?"
              : "Already have an account?"}
          </span>

          <span
            style={styles.footerLink}
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login" ? " Create account" : " Login"}
          </span>
        </div>

      </div>
    </div>
  </>
);
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: 380,
    background: "#1e1e1e",
    padding: "45px 35px",
    borderRadius: 16,
    boxShadow: "0 15px 40px rgba(0,0,0,0.75)",
    textAlign: "center",
  },

  heading: {
    color: "#00ffd0",
    marginBottom: 10,
    fontSize: 28,
  },

  subheading: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 30,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "#2a2a2a",
    color: "#fff",
    fontSize: 15,
  },

  primaryButton: {
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "#00ffd0",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    cursor: "pointer",
    marginTop: 10,
  },

  footer: {
    marginTop: 25,
    fontSize: 14,
    color: "#aaa",
  },

  footerText: {
    opacity: 0.8,
  },

  footerLink: {
    color: "#00ffd0",
    cursor: "pointer",
    fontWeight: "bold",
  },
};