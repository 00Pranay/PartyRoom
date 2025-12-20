import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = {}; // roomId -> array of client sockets

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.log("Invalid JSON");
      return;
    }

    const { type, room } = data;

    // ----- JOIN -----
    if (type === "join") {
      if (!rooms[room]) rooms[room] = [];

      // Reject if room already has 2 users
      if (rooms[room].length >= 2) {
        ws.send(JSON.stringify({ type: "room_full" }));
        return;
      }

      ws.roomId = room;
      rooms[room].push(ws);

      console.log(`User joined room ${room}. Count: ${rooms[room].length}`);

      // Only first user waits
      if (rooms[room].length === 1) {
        ws.send(JSON.stringify({ type: "waiting" }));
      }

      // If 2 users now → second user triggers offer from first user
      if (rooms[room].length === 2) {
        rooms[room][0].send(JSON.stringify({ type: "join_accepted" }));
        rooms[room][1].send(JSON.stringify({ type: "ready_for_offer" }));
      }
    }

    // ----- RELAY OFFER / ANSWER / ICE -----
    if (type === "offer" || type === "answer" || type === "ice") {
      const roomClients = rooms[room];
      if (!roomClients) return;

      roomClients.forEach((client) => {
        if (client !== ws) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });

  // Cleanup disconnected user
  ws.on("close", () => {
    const roomId = ws.roomId;
    if (!roomId) return;

    rooms[roomId] = rooms[roomId].filter((c) => c !== ws);

    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");
