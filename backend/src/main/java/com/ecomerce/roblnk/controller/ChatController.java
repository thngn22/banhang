package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.chat.ChatUserRequest;
import com.ecomerce.roblnk.dto.chat.MessageRequest;
import com.ecomerce.roblnk.model.ChatUser;
import com.ecomerce.roblnk.model.Message;
import com.ecomerce.roblnk.service.ChatUserService;
import com.ecomerce.roblnk.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
@Slf4j
//@RequestMapping("/api/v1/chat")
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatUserService chatUserService;

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<?> findChatMessages(@PathVariable("senderId") String senderId,
                                              @PathVariable("recipientId") String recipientId){
        return ResponseEntity.ok(messageService.findMessages(senderId, recipientId));
    }

    @MessageMapping("/user")
    public void processMessage(@Payload MessageRequest message){
        log.info("message: {}", message.toString());
        messageService.save(message);
        messagingTemplate.convertAndSendToUser(message.getRecipientId(), "/user", message);
    }

    @MessageMapping("/user.addUser")
    @SendTo("/user/topic")
    public MessageRequest addUser(@Payload MessageRequest chatUser){
        return chatUser;
    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/topic")
    public MessageRequest disconnectUser(@Payload MessageRequest chatUser){
        return chatUser;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getConnectedChatUsers(){

        return ResponseEntity.ok(chatUserService.getAllChatUsers());
    }
}
