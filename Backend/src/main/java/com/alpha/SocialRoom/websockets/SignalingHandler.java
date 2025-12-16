package com.alpha.SocialRoom.websockets;

import java.util.*;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

public class SignalingHandler extends TextWebSocketHandler {

    // roomId → list of sessions
    private static final Map<String, List<WebSocketSession>> rooms = new HashMap<>();
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        System.out.println("Connected: " + session.getId());
    }

    @Override
    protected synchronized void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Map<String, Object> data = mapper.readValue(message.getPayload(), Map.class);

        String type = (String) data.get("type");
        String roomId = (String) data.get("room");

        if (type == null || roomId == null) return;

        // -------- JOIN ROOM --------
        if ("join".equals(type)) {

            String username = (String) data.getOrDefault("name", "Guest");

            rooms.putIfAbsent(roomId, new ArrayList<>());
            List<WebSocketSession> clients = rooms.get(roomId);

            if (clients.size() >= 2) {
                session.sendMessage(new TextMessage("{\"type\":\"room_full\"}"));
                return;
            }

            clients.add(session);
            session.getAttributes().put("roomId", roomId);
            session.getAttributes().put("name", username);

            boolean isInitiator = clients.size() == 1;

            Map<String, Object> joinResponse = Map.of(
                    "type", "join_accepted",
                    "room", roomId,
                    "isInitiator", isInitiator,
                    "name", username
            );

            session.sendMessage(new TextMessage(mapper.writeValueAsString(joinResponse)));

            // Notify the other peer
            for (WebSocketSession s : clients) {
                if (s != session) {
                    s.sendMessage(new TextMessage(mapper.writeValueAsString(
                            Map.of("type", "peer_joined", "name", username)
                    )));
                }
            }
            return;
        }


        // -------- WEBRTC SIGNALING --------
        if ("offer".equals(type) || "answer".equals(type) || "ice".equals(type)) {

            List<WebSocketSession> clients = rooms.get(roomId);
            if (clients == null) return;

            for (WebSocketSession peer : clients) {
                if (peer != session) {
                    peer.sendMessage(new TextMessage(message.getPayload()));
                }
            }
            return;
        }


        // -------- CHAT MESSAGE --------
        if ("chat".equals(type)) {

            List<WebSocketSession> clients = rooms.get(roomId);
            if (clients == null) return;

            String text = (String) data.get("text");
            String name = (String) session.getAttributes().get("name");

            Map<String, Object> chatMessage = Map.of(
                    "type", "chat",
                    "room", roomId,
                    "from", name,
                    "text", text,
                    "timestamp", System.currentTimeMillis()
            );

            String json = mapper.writeValueAsString(chatMessage);

            for (WebSocketSession peer : clients) {
                peer.sendMessage(new TextMessage(json));
            }
            return;
        }


        // -------- TYPING INDICATOR --------
        if ("typing".equals(type)) {

            List<WebSocketSession> clients = rooms.get(roomId);
            if (clients == null) return;

            String name = (String) session.getAttributes().get("name");

            String json = mapper.writeValueAsString(
                    Map.of(
                            "type", "typing",
                            "from", name
                    )
            );

            for (WebSocketSession peer : clients) {
                if (peer != session) {
                    peer.sendMessage(new TextMessage(json));
                }
            }
            return;
        }


        // -------- LEAVE --------
        if ("leave".equals(type)) {
            removeUser(session, roomId);
        }
    }


    @Override
    public synchronized void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String roomId = (String) session.getAttributes().get("roomId");
        removeUser(session, roomId);
    }


    private void removeUser(WebSocketSession session, String roomId) {
        if (roomId == null || !rooms.containsKey(roomId)) return;

        List<WebSocketSession> clients = rooms.get(roomId);
        clients.remove(session);

        String name = (String) session.getAttributes().get("name");

        for (WebSocketSession peer : clients) {
            try {
                peer.sendMessage(new TextMessage(
                        "{\"type\":\"peer_left\",\"name\":\"" + name + "\"}"
                ));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (clients.isEmpty()) rooms.remove(roomId);

        System.out.println("Disconnected: " + session.getId());
    }
}