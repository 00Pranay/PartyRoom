package com.alpha.SocialRoom.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.*;
import com.alpha.SocialRoom.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByCreatedAtGreaterThanOrderByCreatedAtAsc(LocalDateTime time);
    void deleteByCreatedAtBefore(LocalDateTime time);
}