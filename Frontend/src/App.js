import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import TestRoom from "./room";
import RoomPage from "./RoomPage";
import CreateRoom from "./CreateRoom";
import GlobalChat from "./GlobalChat";
import JoinGlobalChat from "./GlobalChatName"; // ✅ corrected import

import ChatPage from "./GlobalChat";
import FileChat from "./FileChat";
import Dashboard from "./LoginRegister";
import LoginRegister from "./LoginRegister";
import ReadMe from "./ReadMe";

function App() {
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");

  const handleJoin = (username) => {
    setName(username);

    const ws = new WebSocket("ws://localhost:8080/ws/chat");
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", name: username }));
    };
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestRoom />} />
        <Route path="/CreateRoom" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/LoginRegister"  element={<LoginRegister />}/>
        <Route path="/Dashboard" element={<FileChat/>} />
        <Route path="/ReadMe" element={<ReadMe/>}/>
        {/* FIXED ROUTE */}
        <Route path="/JoinGlobalChat" element={<JoinGlobalChat onJoin={handleJoin} />} />
        <Route path="/chat" element={<GlobalChat socket={socket} name={name} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
