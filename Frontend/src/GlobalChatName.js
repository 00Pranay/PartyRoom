import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

function JoinGlobalChat({ onJoin }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    const finalName =
      name.trim() === ""
        ? "Guest-" + Math.floor(Math.random() * 9000 + 1000)
        : name.trim();

    onJoin(finalName);
    navigate("/chat"); // ✅ now works
  };

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.avatarCircle}>
            <span role="img" aria-label="avatar" style={{ fontSize: "42px" }}>
              👤
            </span>
          </div>

          <h1 style={styles.title}>Welcome to Global Chat</h1>

          <p style={styles.subtext}>
            Anonymous • No Login • 48-Hour Auto-Delete
          </p>

          <input
            style={styles.input}
            placeholder="Choose a nickname..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button style={styles.button} onClick={handleJoin}>
            Enter Chat 🚀
          </button>

          <p style={styles.footer}>
            Your identity remains anonymous. Be respectful & have fun.
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f0f0f, #1c1c1c, #111)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "380px",
    background: "rgba(30, 30, 30, 0.8)",
    padding: "40px 30px 50px",
    borderRadius: "16px",
    textAlign: "center",
    color: "white",
    position: "relative",
    boxShadow: "0 0 20px rgba(0, 255, 180, 0.15)",
    border: "1px solid rgba(0, 255, 180, 0.2)",
    animation: "fadeIn 0.8s ease",
  },
  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
    border: "2px solid rgba(0, 255, 180, 0.2)",
    boxShadow: "0 0 12px rgba(0,255,180,0.2)",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #0affd4, #52f5ff)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    marginBottom: "8px",
  },
  subtext: { fontSize: "14px", opacity: 0.75, marginBottom: "22px" },
  input: {
    width: "90%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "#1b1b1b",
    color: "white",
    fontSize: "16px",
    marginBottom: "20px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #00ffc6, #4affff)",
    border: "none",
    borderRadius: "10px",
    color: "#111",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0,255,200,0.4)",
    transition: "0.25s",
  },
  footer: { marginTop: "18px", fontSize: "12px", opacity: 0.5 },
};

export default JoinGlobalChat;
