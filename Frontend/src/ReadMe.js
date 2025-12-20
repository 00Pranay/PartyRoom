import React, { useState } from "react";
import Navbar from "./NavBar";

export default function ReadMe() {
  const [active, setActive] = useState(null);

  const cards = [
    {
      id: "video",
      title: "🎥 Real-Time Video Call",
      short: "Peer-to-peer video & audio calling system",
      details: (
        <>
          <h3>Video Call Module</h3>
          <p>
            A real-time peer-to-peer video calling system built from scratch to
            understand how modern communication platforms work internally.
          </p>
          <ul>
            <li>WebRTC for audio & video streaming</li>
            <li>STUN servers for NAT traversal</li>
            <li>WebSocket signaling server</li>
            <li>React-based UI with media controls</li>
            <li>Spring Boot backend</li>
          </ul>
          <p>
            Includes mic/camera toggles, remote stream handling, and room-based
            connections.
          </p>
        </>
      ),
    },
    {
      id: "chat",
      title: "💬 Global Open Chat",
      short: "Real-time global chat system",
      details: (
        <>
          <h3>Global Chat Module</h3>
          <p>
            A real-time global chat application where users can join instantly
            and communicate live.
          </p>
          <ul>
            <li>WebSocket bi-directional communication</li>
            <li>Live online users list</li>
            <li>Typing indicators</li>
            <li>Emoji support</li>
            <li>SQL message persistence</li>
            <li>48-hour message auto cleanup</li>
          </ul>
          <p>
            Backend manages concurrency, user tracking, and chat history
            delivery.
          </p>
        </>
      ),
    },
    {
      id: "files",
      title: "📁 Secure File Transfer",
      short: "Personal cloud-style file sharing",
      details: (
        <>
          <h3>File Transfer Module</h3>
          <p>
            A secure file-sharing system where users create accounts and receive
            personal storage space.
          </p>
          <ul>
            <li>Username + password authentication</li>
            <li>BCrypt password hashing</li>
            <li>Spring Boot REST APIs</li>
            <li>React dashboard for uploads/downloads</li>
            <li>SQL database for users & metadata</li>
          </ul>
          <p>
            Designed like a simplified personal cloud where files can be shared
            securely with multiple users.
          </p>
        </>
      ),
    },
    {
      id: "me",
      title: "👨‍💻 About the Developer",
      short: "Project creator & full-stack developer",
      details: (
        <>
          <h3>About Me</h3>
          <p>
            I am a full-stack developer who focuses on deeply understanding how
            systems work instead of relying blindly on libraries.
          </p>
          <ul>
            <li>Frontend: React, JavaScript</li>
            <li>Backend: Spring Boot, REST APIs, WebSockets</li>
            <li>Database: SQL (JPA / Hibernate)</li>
            <li>Security: BCrypt, authentication flows</li>
            <li>Real-time: WebRTC & WebSockets</li>
          </ul>

          <div style={{ marginTop: "15px" }}>
            <p>
              📧{" "}
              <a
                href="mailto:00pranaypawar@gmail.com"
                style={styles.link}
              >
                00pranaypawar@gmail.com
              </a>
            </p>

            <p style={{ marginTop: "8px" }}>
              🔗{" "}
              <a
                href="https://www.linkedin.com/in/pranay-pawar-3707101ab"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                LinkedIn Profile
              </a>
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h1 style={styles.title}>🚀 Project Platform Overview</h1>
        <p style={styles.subtitle}>
          A single platform demonstrating real-time communication and secure
          systems
        </p>

        <div style={styles.cardGrid}>
          {cards.map((c) => (
            <div
              key={c.id}
              style={styles.card}
              onClick={() => setActive(c)}
            >
              <h3>{c.title}</h3>
              <p>{c.short}</p>
            </div>
          ))}
        </div>

        {active && (
          <div style={styles.detailBox}>
            <button
              style={styles.close}
              onClick={() => setActive(null)}
            >
              ✖ Close
            </button>
            {active.details}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#0f0f0f",
    color: "white",
    padding: "40px 40px 20px 40px",
    fontFamily: "Arial, sans-serif",
    overflowY: "auto",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: "35px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#1b1b1b",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.2s",
  },
  detailBox: {
    marginTop: "25px",
    background: "#181818",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  close: {
    float: "right",
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
  link: {
    color: "#00ffd0",
    textDecoration: "none",
  },
};