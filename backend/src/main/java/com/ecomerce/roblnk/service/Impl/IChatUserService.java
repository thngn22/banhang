package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.chat.ChatUserResponse;
import com.ecomerce.roblnk.mapper.ChatMapper;
import com.ecomerce.roblnk.model.ChatUser;
import com.ecomerce.roblnk.repository.ChatUserRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IChatUserService implements ChatUserService {
    private final ChatUserRepository chatUserRepository;
    private final UserRepository userRepository;
    private final ChatMapper chatMapper;
    @Override
    public Optional<ChatUser> getChatUser(String id) {
        var chatUser = chatUserRepository.findById(id);
        if (chatUser.isPresent()) {
            System.out.println(chatUser.get().getId());
            return chatUser;
        }
        else{
            System.out.println("wtf sao lai ko co");
            return Optional.empty();

        }
    }

    @Override
    public void createChatUser(Long userId) {
        var user = userRepository.findById(userId);
        if (user.isPresent()){

            var chatUser = new ChatUser();
            var chatId = String.format("%s", user.get().getEmail().split("@")[0]);
            chatUser.setId(chatId);
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
    public List<ChatUserResponse> getAllChatUsersNotContainingAdmin(String adminUserName) {
        var chat = chatUserRepository.findChatUserByChatRoomsNotEmptyAndIdNotContaining(adminUserName);
        return chatMapper.toChatUserResponseList(chat);
    }
}
