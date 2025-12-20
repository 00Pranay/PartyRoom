package com.alpha.SocialRoom.websockets;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.alpha.SocialRoom.entity.ChatMessage;
import com.alpha.SocialRoom.repository.ChatMessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * WebSocket handler for global chat:
 * - Endpoint should be registered at /ws/chat (see WebSocketConfig below)
 * - Persists messages to DB (last 48h kept by controller/cleaner)
 * - Broadcasts messages to connected clients
 * - Sends history on join
 */
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatMessageRepository repo;
    private static final ObjectMapper mapper = new ObjectMapper();

    // connected sessions and name mapping
    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final ConcurrentMap<String, String> sessionToName = new ConcurrentHashMap<>();

    // scheduled cleaner to delete DB messages older than 48 hours (runs every hour)


    public ChatWebSocketHandler(ChatMessageRepository repo) {
        this.repo = repo;
        // schedule DB cleanup (delete messages older than 48 hours)
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("Chat WS connected: " + session.getId());
        // wait for client to send {"type":"join","name":"Alice"}
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, Object> data = mapper.readValue(message.getPayload(), Map.class);
        String type = (String) data.get("type");
        if (type == null) return;

        switch (type) {
            case "join":
                handleJoin(session, data);
                break;
            case "chat":
                handleChat(session, data);
                break;
            case "typing":
                handleTyping(session, data);
                break;
            case "leave":
                handleLeave(session);
                break;
            default:
                // ignore unknown
        }
    }

    private void handleJoin(WebSocketSession session, Map<String, Object> data) throws IOException {
        String name = Optional.ofNullable((String) data.get("name")).orElse("Guest");
        sessionToName.put(session.getId(), name);

        // Send last 48 hours from DB
        LocalDateTime cutoff = LocalDateTime.now().minusHours(48);
        List<ChatMessage> history = repo.findByCreatedAtGreaterThanOrderByCreatedAtAsc(cutoff);

        List<Map<String,Object>> historyPayload = history.stream().map(m -> {
            Map<String,Object> out = new HashMap<>();
            out.put("id", m.getId());
            out.put("from", m.getSender());
            out.put("text", m.getContent());
            out.put("ts", m.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli());
            return out;
        }).collect(Collectors.toList());

        Map<String,Object> historyMsg = Map.of("type", "history", "messages", historyPayload);
        safeSend(session, mapper.writeValueAsString(historyMsg));

        // notify everyone of updated user list
        broadcastUsers();

        // optional system broadcast that user joined
        Map<String,Object> sys = Map.of("type","system", "text", name + " joined chat", "ts", Instant.now().toEpochMilli());
        broadcastQuietly(sys);
    }

    private void handleChat(WebSocketSession session, Map<String, Object> data) throws IOException {
        String text = (String) data.getOrDefault("text", "");
        if (text == null || text.trim().isEmpty()) return;

        String name = sessionToName.getOrDefault(session.getId(), "Guest");
        LocalDateTime now = LocalDateTime.now();

        // persist to DB
        ChatMessage entity = new ChatMessage(name, text, now);
        ChatMessage saved = repo.save(entity);

        // broadcast to all clients
        Map<String,Object> out = Map.of(
                "type", "chat",
                "id", saved.getId(),
                "from", saved.getSender(),
                "text", saved.getContent(),
                "ts", saved.getCreatedAt().toInstant(ZoneOffset.UTC).toEpochMilli()
        );
        broadcastQuietly(out);
    }

    private void handleTyping(WebSocketSession session, Map<String, Object> data) throws IOException {
        String name = sessionToName.getOrDefault(session.getId(), "Guest");
        Boolean isTyping = (Boolean) data.getOrDefault("isTyping", false);
        Map<String,Object> out = Map.of("type","typing","from",name,"isTyping", isTyping);
        broadcastQuietly(out);
    }

    private void handleLeave(WebSocketSession session) throws IOException {
        removeSession(session);
    }

    private void removeSession(WebSocketSession session) {
        sessions.remove(session);
        String name = sessionToName.remove(session.getId());
        broadcastUsers();
        if (name != null) {
            Map<String,Object> left = Map.of("type","system","text", name + " left chat", "ts", Instant.now().toEpochMilli());
            broadcastQuietly(left);
        }
    }

    private void broadcastUsers() {
        try {
            List<String> users = new ArrayList<>(sessionToName.values());
            Map<String,Object> out = Map.of("type","users","users",users);
            broadcastQuietly(out);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void broadcast(String json) {
        for (WebSocketSession s : sessions) {
            if (s.isOpen()) {
                try {
                    s.sendMessage(new TextMessage(json));
                } catch (Throwable t) {
                    // ignore send errors
                }
            }
        }
    }

    private void broadcastQuietly(Object obj) {
        try {
            broadcast(mapper.writeValueAsString(obj));
        } catch (Exception e) {
        }
    }

    private void safeSend(WebSocketSession s, String json) {
        if (s != null && s.isOpen()) {
            try {
                s.sendMessage(new TextMessage(json));
            } catch (IOException e) {
                // ignore
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        removeSession(session);
        System.out.println("Chat WS disconnected: " + session.getId());
    }
}