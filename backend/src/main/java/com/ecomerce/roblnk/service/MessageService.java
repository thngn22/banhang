package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.model.Message;

import java.util.List;

public interface MessageService {
    Message save(Message message);

    List<Message> findMessages(String senderId, String recipientId);
}
