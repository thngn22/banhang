package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.model.ChatUser;

import java.util.List;

public interface ChatUserService {
    ChatUser getChatUser(String chatUserId);
    void createChatUser(Long userId);
    void saveChatUser(ChatUser chatUser);
    List<ChatUser> getAllChatUsers();
}
