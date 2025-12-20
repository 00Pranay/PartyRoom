// RoomPage.jsx — FIXED & WORKING VERSION

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export default function RoomPage() {
  const { roomId } = useParams();

  // DOM refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Core refs
  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const initiatorRef = useRef(false);   // FIX: uses ref instead of React state
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());

  // UI state
  const [status, setStatus] = useState("Initializing...");
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [game, setGame] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false); // for UI only

  const sendWS = useCallback((msg) => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(msg));
      }
    } catch (e) {
      console.warn("sendWS failed", e);
    }
  }, []);

  // -------------------------------------------------------
  // MAIN EFFECT
  // -------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    // -------------------------------
    // Create PeerConnection
    // -------------------------------
    const createPeer = () => {
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pcRef.current.ontrack = (ev) => {
        ev.streams[0].getTracks().forEach((t) =>
          remoteStreamRef.current.addTrack(t)
        );
        if (remoteVideoRef.current)
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
      };

      pcRef.current.onicecandidate = (ev) => {
        if (ev.candidate) {
          sendWS({ type: "ice", room: roomId, candidate: ev.candidate });
        }
      };

      pcRef.current.onconnectionstatechange = () => {
        const s = pcRef.current.connectionState;
        setStatus("PeerConnection: " + s);
      };

      return pcRef.current;
    };

    // -------------------------------
    // Start Camera/Mic
    // -------------------------------
    const startLocalMedia = async () => {
      const st = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = st;

      if (localVideoRef.current) localVideoRef.current.srcObject = st;

      const pc = pcRef.current || createPeer();
      st.getTracks().forEach((t) => pc.addTrack(t, st));
    };

    // -------------------------------
    // MAIN STARTUP
    // -------------------------------
    (async function () {
          try {
            setStatus("Starting camera...");
            await startLocalMedia();
            const WS_URL=process.env.REACT_APP_WS_URL;
            wsRef.current = new WebSocket(`${WS_URL}/ws`);

        wsRef.current.onopen = () => {
          setStatus("Connected to server. Joining room...");
          sendWS({ type: "join", room: roomId });
        };

        wsRef.current.onmessage = async (msg) => {
          if (!mounted) return;

          let data;
          try {
            data = JSON.parse(msg.data);
          } catch {
            return;
          }

          // -------------------------------
          // ROOM FULL
          // -------------------------------
          if (data.type === "room_full") {
            alert("Room is full.");
            setStatus("Room full");
            wsRef.current.close();
            return;
          }

          // -------------------------------
          // JOIN ACCEPTED
          // -------------------------------
          if (data.type === "join_accepted") {
            initiatorRef.current = Boolean(data.isInitiator); // FIX
            setIsInitiator(Boolean(data.isInitiator)); // UI only
            setStatus(
              data.isInitiator
                ? "Joined — You are initiator"
                : "Joined — Waiting for offer"
            );
            return;
          }

          // -------------------------------
          // PEER JOINED
          // -------------------------------
          if (data.type === "peer_joined") {
            setStatus("Peer joined — setting up call...");

            if (initiatorRef.current) {
              try {
                const offer = await pcRef.current.createOffer();
                await pcRef.current.setLocalDescription(offer);
                sendWS({ type: "offer", room: roomId, offer });
                setStatus("Offer sent — waiting for answer...");
              } catch (e) {
                console.error("offer error", e);
              }
            }
            return;
          }

          // -------------------------------
          // OFFER RECEIVED
          // -------------------------------
          if (data.type === "offer") {
            await pcRef.current.setRemoteDescription(data.offer);

            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);

            sendWS({ type: "answer", room: roomId, answer });
            setStatus("Answer sent — call connecting...");
            return;
          }

          // -------------------------------
          // ANSWER RECEIVED
          // -------------------------------
          if (data.type === "answer") {
            await pcRef.current.setRemoteDescription(data.answer);
            setStatus("Answer received — call connected");
            return;
          }

          // -------------------------------
          // ICE CANDIDATE
          // -------------------------------
          if (data.type === "ice") {
            try {
              await pcRef.current.addIceCandidate(data.candidate);
            } catch (e) {
              console.warn("ICE error", e);
            }
          }
        };
      } catch (e) {
        setStatus("Error starting room.");
        console.error(e);
      }
    })();

    // -------------------------------
    // CLEANUP
    // -------------------------------
    return () => {
      mounted = false;
      try {
        sendWS({ type: "leave", room: roomId });
      } catch {}
      wsRef.current?.close();
      pcRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId, sendWS]);

  // -------------------------------------------------------
  // BUTTONS
  // -------------------------------------------------------
  const toggleMic = () => {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setMicEnabled((s) => !s);
  };

  const toggleCam = () => {
    localStreamRef.current
      ?.getVideoTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setCamEnabled((s) => !s);
  };

  const leaveRoom = () => {
    sendWS({ type: "leave", room: roomId });
    wsRef.current?.close();
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    window.location.href = "/";
  };

  const openGame = (g) => setGame(g);
  const closeGame = () => setGame(null);

  const GAME_URLS = {
    ludo: "https://krunker.io",
    chess: "https://www.parte.me",
    uno: "https://uno-online.io/",
  };

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  const leftStyle = {
    width: "20%",
    padding: 5,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    background: "#0b0b0b",
  };

  const rightStyle = {
    width: "0%",
    padding: 12,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  };

  const videoStyle = {
    width: "100%",
    height: 250,
    background: "#111",
    borderRadius: 8,
    objectFit: "cover",
  };

return (
  <div
    style={{
      display: "flex",
      height: "100vh",
      background: "#0e0e0e",
      color: "white",
      fontFamily: "Inter, sans-serif",
    }}
  >
    {/* LEFT PANEL */}
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #222",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "20px", color: "#8ab4ff" }}>
        Room ID: {roomId}
      </h2>

      {/* VIDEO AREA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* REMOTE */}
        <div>
          <h4 style={{ margin: "4px 0", color: "#ccc" }}>Remote</h4>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: "90%",
              height: "260px",
              background: "#000",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        </div>

        {/* LOCAL */}
        <div>
          <h4 style={{ margin: "4px 0", color: "#ccc" }}>You</h4>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "90%",
              height: "260px",
              background: "#000",
              borderRadius: 8,
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button
          onClick={toggleMic}
          style={{
            padding: "8px 14px",
            background: "#222",
            border: "1px solid #444",
            borderRadius: 6,
            color: "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {micEnabled ? "Mute" : "Unmute"}
        </button>

        <button
          onClick={toggleCam}
          style={{
            padding: "8px 14px",
            background: "#222",
            border: "1px solid #444",
            borderRadius: 6,
            color: "white",
            cursor: "pointer",
            transition: "0.2s",
          }}
        >
          {camEnabled ? "Hide Cam" : "Show Cam"}
        </button>

        <button
          onClick={leaveRoom}
          style={{
            padding: "8px 14px",
            background: "#c83333",
            border: "none",
            borderRadius: 6,
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Leave
        </button>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div
      style={{
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* GAME BUTTONS */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => openGame("ludo")}
          style={{
            padding: "8px 16px",
            background: "#1d1d1d",
            border: "1px solid #333",
            borderRadius: 6,
            color: "#9bbbff",
            cursor: "pointer",
          }}
        >
          Play Shooter Online
        </button>

        <button
          onClick={() => openGame("chess")}
          style={{
            padding: "8px 16px",
            background: "#1d1d1d",
            border: "1px solid #333",
            borderRadius: 6,
            color: "#9bbbff",
            cursor: "pointer",
          }}
        >
          Play Parte
        </button>

        <button
          onClick={() => openGame("uno")}
          style={{
            padding: "8px 16px",
            background: "#1d1d1d",
            border: "1px solid #333",
            borderRadius: 6,
            color: "#9bbbff",
            cursor: "pointer",
          }}
        >
          Play Uno
        </button>

        {game && (
          <button
            onClick={closeGame}
            style={{
              padding: "8px 16px",
              background: "#552222",
              border: "none",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* IFRAME / EMPTY SCREEN */}
      <div
        style={{
          flex: 1,
          background: "#111",
          borderRadius: 10,
          border: "1px solid #222",
          overflow: "hidden",
        }}
      >
        {game ? (
          <iframe
            src={GAME_URLS[game]}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#999",
            }}
          >
            <h2>Select a game to start</h2>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
