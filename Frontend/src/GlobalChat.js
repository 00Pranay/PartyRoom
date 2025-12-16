import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

export default function ChatPage({ socket, name: username }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup on exit
  useEffect(() => {
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "leave" }));
        socket.close();
      }
    };
  }, [socket]);

  // WebSocket listeners
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        const formatted = data.messages.map((m) => ({
          sender: m.from,
          text: m.text,
          timestamp: m.ts,
        }));
        setMessages(formatted);
      }

      if (data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          { sender: data.from, text: data.text, timestamp: data.ts },
        ]);
      }

      if (data.type === "system") {
        setMessages((prev) => [
          ...prev,
          { sender: "System", text: data.text, timestamp: data.ts },
        ]);
      }

      if (data.type === "users") {
        setOnlineUsers(data.users);
      }

      if (data.type === "typing") {
        setTypingUser(data.isTyping ? data.from : "");
      }
    };
  }, [socket]);

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.send(
      JSON.stringify({
        type: "chat",
        text: message,
      })
    );

    setMessages((prev) => [
      ...prev,
      { sender: username, text: message, timestamp: Date.now() },
    ]);

    setMessage("");
  };

  const onTyping = (e) => {
    setMessage(e.target.value);

    socket.send(
      JSON.stringify({
        type: "typing",
        isTyping: e.target.value.length > 0,
      })
    );
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={{ margin: 0 }}>Users Online</h3>

        <div style={{ marginTop: 12 }}>
          {onlineUsers.length === 0 ? (
            <div style={{ color: "#999" }}>No users</div>
          ) : (
            onlineUsers.map((u, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: "#1b1b1b",
                  marginBottom: 6,
                }}
              >
                {u}
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={styles.main}>
        <div style={styles.headerRow}>
          <div style={{ fontSize: 18 }}>🌍 Global Chat</div>

          <div style={{ opacity: 0.7 }}>
            {typingUser ? `${typingUser} is typing...` : ""}
          </div>
        </div>

        <div style={styles.chatWindow}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={m.sender === username ? styles.msgMine : styles.msgOther}
            >
              {m.sender !== "System" && (
                <div style={{ fontSize: 12, opacity: 0.8 }}>{m.sender}</div>
              )}

              <div style={{ marginTop: 4 }}>{m.text}</div>

              <div
                style={{
                  fontSize: 10,
                  opacity: 0.6,
                  marginTop: 6,
                  textAlign: "right",
                }}
              >
                {formatTime(m.timestamp)}
              </div>
            </div>
          ))}

          <div ref={chatEndRef}></div>
        </div>

        <div style={styles.inputRow}>
          <button
            onClick={() => setShowEmoji((s) => !s)}
            style={styles.iconBtn}
          >
            😊
          </button>

          {showEmoji && (
            <div style={styles.emojiPopup}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <input
            value={message}
            onChange={onTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={styles.msgInput}
          />

          <button onClick={sendMessage} style={styles.sendBtn}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- STYLES -----------------

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#0f1115",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
  },
  sidebar: {
    width: 250,
    padding: 20,
    borderRight: "1px solid #16181c",
    boxSizing: "border-box",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 20,
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: 12,
    background: "#0b0c0e",
    borderRadius: 8,
    border: "1px solid #16181c",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  msgMine: {
    alignSelf: "flex-end",
    background: "#2e7dff",
    padding: 12,
    borderRadius: 10,
    maxWidth: "65%",
  },
  msgOther: {
    alignSelf: "flex-start",
    background: "#16181b",
    padding: 12,
    borderRadius: 10,
    maxWidth: "65%",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  iconBtn: {
    background: "#0b0c0e",
    border: "1px solid #222",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
  },
  emojiPopup: {
    position: "absolute",
    bottom: 70,
    left: 100,
    zIndex: 30,
  },
  msgInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#0b0c0e",
    color: "white",
  },
  sendBtn: {
    padding: "10px 14px",
    borderRadius: 8,
    background: "#2e7dff",
    border: "none",
    cursor: "pointer",
  },
};
