package com.alpha.SocialRoom.websockets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.alpha.SocialRoom.repository.ChatMessageRepository;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final SignalingHandler signalingHandler;
    private final ChatMessageRepository repo;

    // ✅ One constructor – Spring will inject everything
    public WebSocketConfig(SignalingHandler signalingHandler, ChatMessageRepository repo) {
        this.signalingHandler = signalingHandler;
        this.repo = repo;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

        // ---- Video Call WebSocket ----
        registry.addHandler(signalingHandler, "/ws")
                .setAllowedOrigins("*");

        // ---- Global Chat WebSocket ----
        registry.addHandler(chatHandler(), "/ws/chat")
                .setAllowedOrigins("*");
    }

    // ✅ Chat handler bean with repo injected
    @Bean
    public ChatWebSocketHandler chatHandler() {
        return new ChatWebSocketHandler(repo);
    }
}