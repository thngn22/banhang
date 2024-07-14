package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.chat.ChatUserResponse;
import com.ecomerce.roblnk.model.ChatUser;

import java.util.List;
import java.util.Optional;

public interface ChatUserService {
    Optional<ChatUser> getChatUser(String chatUserId);
    void createChatUser(Long userId);
    void saveChatUser(ChatUser chatUser);
    List<ChatUserResponse> getAllChatUsersNotContainingAdmin(String adminUserName);
}
