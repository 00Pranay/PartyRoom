package com.alpha.SocialRoom.websockets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketHandler {
    @Bean
    public SignalingHandler signalingHandler(){
        return new SignalingHandler();
    }
}
