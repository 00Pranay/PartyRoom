package com.alpha.SocialRoom.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.alpha.SocialRoom.entity.ChatMessage;
import com.alpha.SocialRoom.repository.ChatMessageRepository;

@Service
public class ChatMessageService {

    private final ChatMessageRepository repo;

    public ChatMessageService(ChatMessageRepository repo) {
        this.repo = repo;
    }

    public ChatMessage saveMessage(String sender, String content) {
        ChatMessage msg = new ChatMessage(sender, content, LocalDateTime.now());
        return repo.save(msg);
    }

    public List<ChatMessage> getAllMessages() {
        return repo.findAll();
    }
}