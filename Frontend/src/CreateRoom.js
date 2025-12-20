import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

function CreateRoom() {
const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const createRoom = async () => {
    try{
    const API_URL=process.env.REACT_APP_API_URL;
    console.log("HERE ",API_URL);
    const res = await fetch(`${API_URL}/api/room/create`,
    { method: "POST" ,
     headers:{
     "Content-Type":"application/json",}
     });
    const code = await res.text();
    setRoomCode(code);
    setMessage(`Room Created: ${code}`);
    }
    catch(err){
      console.error("Error creating room",err);
    }
  };

  const joinRoom = async () => {
  const API_URL=process.env.REACT_APP_API_URL;
    const res = await fetch(`${API_URL}/api/room/exists/${joinCode}`);
    const exists = await res.json();
    if(exists){
    setMessage(exists ? `Joined Room: ${joinCode}` : "Room not found");
    navigate(`/room/${joinCode}`) 
  }
};

return ( 
<div style={{
fontFamily: "'Comic Neue', cursive, sans-serif",
minHeight: '100vh',
background: '#1e1e2e',
color: '#f5f5f5',
overflowX: 'hidden',
paddingBottom: '40px'
}}>
{/* NAVBAR */}
<Navbar/>

  {/* HERO */}
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 16px', gap: '20px', textAlign: 'center'
  }}>
    <h2 style={{ fontSize: '2rem', color: '#5c7cfa' }}>Create or Join a Room</h2>
    <p style={{ maxWidth: '500px', fontSize: '1rem', color: '#ccc' }}>
      Start a video hangout with friends! You can create a new room or join an existing one.
    </p>

    {/* CREATE ROOM */}
    <button
      onClick={createRoom}
      style={{
        padding: '14px 32px',
        fontSize: '1.1rem',
        background: 'linear-gradient(90deg, #5c7cfa, #7fa8ff)',
        color: '#fff',
        border: 'none',
        borderRadius: '28px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 6px 14px rgba(92,124,250,0.4)',
        transition: '0.3s'
      }}
      onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
      onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
    >
      Create Room
    </button>

    {roomCode && (
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', color: '#a5d6ff', fontWeight: 'bold' }}>Room Code: {roomCode}</p>
        <button
          onClick={() => navigate(`/room/${roomCode}`)}
          style={{
            padding: '10px 24px',
            fontSize: '1rem',
            background: '#a5d6ff',
            color: '#1e1e2e',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(165,214,255,0.3)',
            marginTop: '6px'
          }}
        >
          Enter Room
        </button>
      </div>
    )}

    {/* JOIN ROOM */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '30px' }}>
      <input
        type="text"
        placeholder="Enter room code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        style={{
          padding: '12px 16px',
          fontSize: '1rem',
          borderRadius: '20px',
          border: '2px solid #5c7cfa',
          background: '#2a2a3d',
          color: '#fff',
          width: '240px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}
      />
      <button
        onClick={joinRoom}
        style={{
          padding: '12px 28px',
          fontSize: '1.05rem',
          background: 'linear-gradient(90deg, #5c7cfa, #7fa8ff)',
          color: '#fff',
          border: 'none',
          borderRadius: '24px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(92,124,250,0.4)',
          transition: '0.3s'
        }}
        onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
        onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
      >
        Join Room
      </button>
    </div>

    {message && <p style={{ marginTop: '14px', color: '#a5d6ff', fontWeight: 'bold' }}>{message}</p>}
  </div>
</div>

);
}

export default CreateRoom;