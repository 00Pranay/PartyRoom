package com.alpha.SocialRoom.controller;

import org.springframework.web.bind.annotation.*;

import com.alpha.SocialRoom.entity.ChatMessage;
import com.alpha.SocialRoom.repository.ChatMessageRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatMessageController {

    private final ChatMessageRepository repo;

    public ChatMessageController(ChatMessageRepository repo) {
        this.repo = repo;
    }

    // ✅ Get messages from the last 48 hours
    @GetMapping("/latest")
    public List<ChatMessage> getMessages() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(48);
        return repo.findByCreatedAtGreaterThanOrderByCreatedAtAsc(cutoff);
    }

    // ✅ Send and save a new message
    @PostMapping("/send")
    public ChatMessage sendMessage(@RequestBody ChatMessage msg) {
        msg.setCreatedAt(LocalDateTime.now());
        return repo.save(msg);
    }
}