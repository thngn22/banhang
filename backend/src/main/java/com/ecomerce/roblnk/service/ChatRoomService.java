package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.model.ChatRoom;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ChatRoomService {
    Optional<ChatRoom> getChatRoomId(String senderId, String recipientId, boolean createNewIfNotExists);

    ChatRoom createChatRoomId(String senderId, String recipientId);
}
