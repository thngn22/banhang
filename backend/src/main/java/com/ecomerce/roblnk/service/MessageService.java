package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.chat.MessageRequest;
import com.ecomerce.roblnk.model.Message;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MessageService {
    void save(MessageRequest message);

    ResponseEntity<?> findMessages(String senderId, String recipientId);
}
