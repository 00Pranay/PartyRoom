import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [shareUser, setShareUser] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("fileUser");

  useEffect(() => {
    if (!username) navigate("/");
    else fetchFiles();
  }, []);

  // Fetch user files
  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/files/list?username=${username}`,
        { credentials: "include" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setFiles(data || []);
      setSelectedFiles(new Set());
    } catch (err) { console.error(err); }
  };

  // Upload a new file
  const uploadFile = async () => {
    if (!file) return alert("Select a file first");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);

    try {
      const res = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) return alert("Upload failed");
      alert("File uploaded successfully");
      setFile(null);
      fetchFiles();
    } catch (err) { console.error(err); }
  };

  // Download a file
  const downloadFile = (filename) => {
    window.open(
      `http://localhost:8080/api/files/download/${username}/${filename}`,
      "_blank"
    );
  };

  // Delete single file
  const deleteFile = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;
    try {
      const res = await fetch("http://localhost:8080/api/files/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, filename }),
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Delete failed");
      alert("File deleted successfully");
      fetchFiles();
    } catch (err) { console.error(err); alert("Delete failed"); }
  };

  // Multi-delete selected files
  const deleteSelectedFiles = async () => {
    if (selectedFiles.size === 0) return alert("Select at least one file to delete");
    if (!window.confirm(`Delete ${selectedFiles.size} selected files?`)) return;

    for (const f of selectedFiles) {
      await deleteFile(f);
    }
    setSelectedFiles(new Set());
  };

  // Toggle checkbox for selection
  const toggleSelectFile = (filename) => {
    const newSet = new Set(selectedFiles);
    if (newSet.has(filename)) newSet.delete(filename);
    else newSet.add(filename);
    setSelectedFiles(newSet);
  };

  // Share selected files with another user
  const shareSelectedFiles = async () => {
    if (!shareUser) return alert("Enter recipient username");
    if (selectedFiles.size === 0) return alert("Select at least one file");

    for (const f of selectedFiles) {
      try {
        const res = await fetch("http://localhost:8080/api/files/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromUser: username, toUser: shareUser, filename: f }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) alert(`Failed to share ${f}: ${data.message}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to share ${f}`);
      }
    }
    alert("Selected files shared successfully");
    setSelectedFiles(new Set());
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("fileUser");
    navigate("/");
  };

  // File preview logic
  const getFilePreview = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const previewUrl = `http://localhost:8080/api/files/preview/${username}/${filename}`;

    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      return <img src={previewUrl} alt={filename} style={styles.preview} />;
    }
    if (ext === "pdf") {
      return <iframe src={previewUrl} style={styles.previewIframe} title={filename} />;
    }
    return <div style={styles.noPreview}>No preview</div>;
  };

  return (
    <>
    <Navbar/>
    <div style={styles.page}>
      <header style={styles.header}>
        <h2 style={styles.logo}>FileShare Dashboard</h2>
        <div>
          <span  style={styles.username}>User: {username}</span>
          <button onClick={logout} style={styles.logout}>Logout</button>
        </div>
      </header>

      <div style={styles.main}>
        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Upload File</h3>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.inputFile} />
            <button onClick={uploadFile} style={styles.primaryButton}>Upload</button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Share Files</h3>
            <input
              placeholder="Recipient username"
              value={shareUser}
              onChange={(e) => setShareUser(e.target.value)}
              style={styles.input}
            />
            <button onClick={shareSelectedFiles} style={styles.primaryButton}>Share Selected</button>
            <button onClick={deleteSelectedFiles} style={styles.deleteSelectedButton}>Delete Selected</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel}>
          <h3 style={{ marginBottom: 20 }}>Your Files</h3>
          {files.length === 0 ? (
            <p style={{ color: "#aaa" }}>No files uploaded yet</p>
          ) : (
            <div style={styles.fileGrid}>
              {files.map((f) => (
                <div key={f} style={styles.fileCard}>
                  {getFilePreview(f)}
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(f)}
                    onChange={() => toggleSelectFile(f)}
                    style={{ marginBottom: 10 }}
                  />
                  <span style={styles.fileName}>{f}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => downloadFile(f)} style={styles.downloadButton}>Download</button>
                    <button onClick={() => deleteFile(f)} style={styles.deleteButton}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
const styles = {
  // Page
  page: { 
    padding: 20, 
    background: "#111", 
    color: "#fff", 
    fontFamily: "Arial, sans-serif", 
    minHeight: "100vh" 
  },

  // Header
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 30, 
    padding: "10px 20px" 
  },
  welcome: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#00ffd0", 
    margin: 0, 
    flex: 0,           // prevent it from stretching
    textAlign: "center"
  },
  logout: { 
    padding: "6px 12px", 
    background: "#ff4d4d", 
    border: "none", 
    borderRadius: 6, 
    cursor: "pointer", 
    fontWeight: "500",
    marginLeft: 20,      // adds gap between H2 and button
    transition: "0.2s"
  },

  // Main panels
  main: { display: "flex", gap: 30 },
  leftPanel: { flex: 1, display: "flex", flexDirection: "column", gap: 20 },
  rightPanel: { flex: 2 },

  // Cards
  card: { 
    background: "#1e1e1e", 
    padding: 20, 
    borderRadius: 12, 
    boxShadow: "0 5px 15px rgba(0,0,0,0.5)" 
  },
  cardTitle: { marginBottom: 15, color: "#00ffd0" },

  // Inputs / Buttons
  inputFile: { marginBottom: 10 },
  input: { width: "100%", padding: 10, borderRadius: 6, border: "none", marginBottom: 10 },
  primaryButton: { padding: "10px 16px", borderRadius: 6, border: "none", background: "#00ffd0", cursor: "pointer", fontWeight: "bold" },
  deleteSelectedButton: { padding: "10px 16px", borderRadius: 6, border: "none", background: "#ff4d4d", cursor: "pointer", fontWeight: "bold", marginTop: 10 },

  // File grid
  fileGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 15 },
  fileCard: { 
    background: "#222", 
    padding: 15, 
    borderRadius: 10, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)" 
  },
  fileName: { marginBottom: 10, textAlign: "center", wordBreak: "break-word" },
  downloadButton: { padding: "6px 12px", borderRadius: 6, border: "none", background: "#00ffd0", cursor: "pointer", fontWeight: "bold", marginBottom: 5 },
  deleteButton: { padding: "6px 12px", borderRadius: 6, border: "none", background: "#ff4d4d", cursor: "pointer", fontWeight: "bold" },

  // Previews
  preview: { width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6, marginBottom: 10 },
  previewIframe: { width: "100%", height: 120, borderRadius: 6, marginBottom: 10 },
  noPreview: { width: "100%", height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", marginBottom: 10, background: "#111", borderRadius: 6 },
};