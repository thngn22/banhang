package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.model.ChatRoom;
import com.ecomerce.roblnk.repository.ChatRoomRepository;
import com.ecomerce.roblnk.service.ChatRoomService;
import com.ecomerce.roblnk.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class IChatRoomService implements ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatUserService chatUserService;
    @Override
    public Optional<ChatRoom> getChatRoomId(String senderId, String recipientId, boolean createNewIfNotExists) {


        return chatRoomRepository.findBySenderId_IdAndRecipientId_Id(
                senderId, recipientId)
                .or(() ->{
                    if (createNewIfNotExists){
                        var chatRooms = createChatRoomId(senderId, recipientId);
                        return Optional.of(chatRooms);
                    }
                    return Optional.empty();
                });
    }

    @Override
    public ChatRoom createChatRoomId(String senderId, String recipientId) {
        var chatRoomIdSender = String.format("%s_%s", senderId, recipientId);
        var chatRoomIdRecipient = String.format("%s_%s", recipientId, senderId);
        var sender = chatUserService.getChatUser(senderId);
        var recipient = chatUserService.getChatUser(recipientId);


        ChatRoom senderRecipient = new ChatRoom();
        senderRecipient.setId(chatRoomIdSender);
        senderRecipient.setSenderId(sender);
        senderRecipient.setRecipientId(recipient);

        ChatRoom recipientSender = new ChatRoom();
        recipientSender.setId(chatRoomIdRecipient);
        recipientSender.setSenderId(recipient);
        recipientSender.setRecipientId(sender);

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);

        sender.getChatRooms().add(senderRecipient);
        recipient.getChatRooms().add(recipientSender);

        chatUserService.saveChatUser(sender);
        chatUserService.saveChatUser(recipient);

        return senderRecipient;
    }
}
