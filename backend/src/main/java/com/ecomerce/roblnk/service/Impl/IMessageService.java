package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.chat.MessageRequest;
import com.ecomerce.roblnk.model.Message;
import com.ecomerce.roblnk.repository.MessageRepository;
import com.ecomerce.roblnk.service.ChatRoomService;
import com.ecomerce.roblnk.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IMessageService implements MessageService {
    private final MessageRepository messageRepository;
    private final ChatRoomService chatRoomService;

    @Override
    public void save(MessageRequest messageRequest){
        var chatRoom = chatRoomService.getChatRoomId(messageRequest.getSenderId(), messageRequest.getRecipientId(), true).orElseThrow();
        var messageFromDb = messageRepository.findById(chatRoom.getMessages().get(0).getId());
        if (messageFromDb.isEmpty()){
            var message = new Message();
            message.setChatRoomId(chatRoom);
            message.setSenderId(message.getSenderId());
            message.setRecipientId(message.getRecipientId());
            message.setContent(message.getContent());
            messageRepository.save(message);
        }

    }

    @Override
    public ResponseEntity<?> findMessages(String senderId, String recipientId){
        var chatRoom = chatRoomService.getChatRoomId(senderId, recipientId, false);
        if (chatRoom.isPresent()){
            return ResponseEntity.ok(chatRoom.get().getMessages());
        }
        else return ResponseEntity.status(403).body("List not found!");
    }
}
