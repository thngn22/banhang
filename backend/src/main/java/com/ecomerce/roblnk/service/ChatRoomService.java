package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.model.ChatRoom;

import java.util.List;

public interface ChatRoomService {
    List<ChatRoom> getChatRoomId(String senderId, String recipientId, boolean createNewIfNotExists);

    List<ChatRoom> createChatRoomId(String senderId, String recipientId);
}
