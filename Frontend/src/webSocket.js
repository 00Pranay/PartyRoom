// let socket = null;

// export function connectWebSocket(roomId,onMessage){
//     socket = new WebSocket("ws://localhost:8080/ws");

//     socket.onopen= ()=>
//     {
//         console.log("Connected to signaling server");
//         socket.send(JSON.stringify({
//             type:"join",
//             room:roomId
//         }));
//     };
//     socket.onmessage=(event)=>{
//         const data = JSON.parse(event.data);
//         onMessage(data);
//     };
//     socket.onerror=(err)=>{
//         console.error("WebSocket error:",err);
//     }
// }
// export function sendMessage (message){
//     socket.send(JSON.stringify(message));
// }