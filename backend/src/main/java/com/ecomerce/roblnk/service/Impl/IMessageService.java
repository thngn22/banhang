package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.model.Message;
import com.ecomerce.roblnk.repository.MessageRepository;
import com.ecomerce.roblnk.service.ChatRoomService;
import com.ecomerce.roblnk.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IMessageService implements MessageService {
    private final MessageRepository messageRepository;
    private final ChatRoomService chatRoomService;

    @Override
    public Message save(Message message){
        var chatId = chatRoomService.getChatRoomId(message.getSenderId().getId(), message.getRecipientId().getId(), true).orElseThrow();
        message.setChatRoomId(chatId);
        messageRepository.save(message);
        return message;
    }

    @Override
    public List<Message> findMessages(String senderId, String recipientId){
        var chatRoom = chatRoomService.getChatRoomId(senderId, recipientId, false);
        if (chatRoom.isPresent()){
            return chatRoom.get().getMessages();
        }
        else return new ArrayList<>();
    }
}
