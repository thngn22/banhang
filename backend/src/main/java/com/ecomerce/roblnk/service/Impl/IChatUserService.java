package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.model.ChatUser;
import com.ecomerce.roblnk.repository.ChatUserRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IChatUserService implements ChatUserService {
    private final ChatUserRepository chatUserRepository;
    private final UserRepository userRepository;
    @Override
    public ChatUser getChatUser(String id) {
        var chatUser = chatUserRepository.findById(id);
        return chatUser.orElse(null);

    }

    @Override
    public void createChatUser(Long userId) {
        var user = userRepository.findById(userId);
        if (user.isPresent()){

            var chatUser = new ChatUser();
            var chatId = String.format("%s", user.get().getEmail().split("@")[0]);
            chatUser.setId(chatId);
            chatUser.setRole(user.get().getRoles().toString());
            chatUser.setAvatar(user.get().getAvatar());
            chatUser.setFullName(user.get().getFirstName() + " " + user.get().getLastName());
            chatUser.setUser(user.get());
            chatUserRepository.save(chatUser);
            user.get().setChatUser(chatUser);
            userRepository.save(user.get());

        }

    }

    @Override
    public void saveChatUser(ChatUser chatUser) {
        chatUserRepository.save(chatUser);
    }

    @Override
    public List<ChatUser> getAllChatUsers() {
        return chatUserRepository.findAllByChatRoomsNotEmpty();
    }
}
