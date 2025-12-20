import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

function TestRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const createRoom = async () => {
    try{
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/room/create`, { method: "POST" });
    const code = await res.text();
    setRoomCode(code);
    setMessage(`Room Created: ${code}`);
    }
    catch(err){
      console.error("Error creating room",err);
    }
  };

  const joinRoom = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/room/exists/${joinCode}`);
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
    position: 'relative',
    paddingBottom: '40px'
  }}>{/* NAVBAR */}

<Navbar/>

{/* HERO */}
<div style={{
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', padding: '60px 16px', gap: '16px', textAlign: 'center'
}}>
  <h2 style={{ fontSize: '2rem', color: '#5c7cfa' }}>Hangout & Chill With Friends</h2>
  <p style={{ maxWidth: '500px', fontSize: '1rem', color: '#ccc' }}>
    Create a room, join your friends, start video calls, chat, and share files — all in one friendly digital lounge.
  </p>

  {/* Main Action Button */}
  <button
    onClick={() => navigate('/CreateRoom')} // redirect to the room creation page
    style={{
      marginTop: '20px',
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
    Enter Video Lounge
  </button>
</div>

{/* FEATURE CARDS */}
<div style={{
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
  gap: '18px', padding: '24px 16px', marginTop: '40px'
}}>
  {[
    {name:'Video Call', desc:'High-quality 1v1 calls to see your friends live!'},
    {name:'Open Chat', desc:'Send memes, jokes or hangout messages.'},
    {name:'File Transfer', desc:'Share pics, music & files instantly.'},
    {name:'Read Me', desc:'Tips & tricks to make your room epic!'}
  ].map(feature => (
    <div key={feature.name} style={{
      background: '#2a2a3d',
      padding: '16px',
      borderRadius: '20px',
      width: '210px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(92,124,250,0.2)',
      transition: '0.3s'
    }}
    onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
    onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
    >
      <h3 style={{ color: '#5c7cfa', fontSize: '1.2rem', marginBottom: '6px' }}>{feature.name}</h3>
      <p style={{ color: '#ccc', fontSize: '0.88rem' }}>{feature.desc}</p>
    </div>
  ))}
</div>

  </div>
);
}
export default TestRoom;