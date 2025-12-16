import { useState } from "react";

function JoinRoom({ onJoin }) {
    const [roomId, setRoomId] = useState("");

    const handleJoin = () => {
        if (roomId.trim() === "") return;
        onJoin(roomId);
    };

    return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>Join a Room</h2>

            <input 
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{ padding: "10px", fontSize: "16px" }}
            />

            <br /><br />

            <button 
                style={{ padding: "10px 20px", fontSize: "16px" }}
                onClick={handleJoin}
            >
                Join
            </button>
        </div>
    );
}

export default JoinRoom;
