package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.chat.MessageRequest;
import com.ecomerce.roblnk.mapper.MessageMapper;
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
    private final MessageMapper messageMapper;

    @Override
    public void save(MessageRequest messageRequest){
        var chatRoom = chatRoomService.getChatRoomId(messageRequest.getSenderId(), messageRequest.getRecipientId(), true);
        var chatRoomSender = chatRoom.get(0);
        var chatRoomRecipient = chatRoom.get(1);
        var message = new Message();
        message.setChatRoomId(chatRoomSender);
        message.setSenderId(chatRoomSender.getSenderId());
        message.setRecipientId(chatRoomSender.getRecipientId());
        message.setContent(messageRequest.getContent());

        var message2 = new Message();
        message2.setChatRoomId(chatRoomRecipient);
        message2.setSenderId(chatRoomSender.getSenderId());
        message2.setRecipientId(chatRoomSender.getRecipientId());
        message2.setContent(messageRequest.getContent());

        messageRepository.save(message);
        messageRepository.save(message2);

    }

    @Override
    public ResponseEntity<?> findMessages(String senderId, String recipientId){
        var chatRoom = chatRoomService.getChatRoomId(senderId, recipientId, false);
        if (!chatRoom.isEmpty()){
            return ResponseEntity.ok(messageMapper.toMessageResponseList(chatRoom.get(0).getMessages()));
        }
        else return ResponseEntity.status(403).body("List not found!");
    }
}
