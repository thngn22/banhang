package com.ecomerce.roblnk.controller;

import com.ecomerce.roblnk.dto.chat.ChatUserRequest;
import com.ecomerce.roblnk.dto.chat.MessageRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.exception.InputFieldException;
import com.ecomerce.roblnk.model.ChatUser;
import com.ecomerce.roblnk.model.Message;
import com.ecomerce.roblnk.model.Role;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.service.ChatUserService;
import com.ecomerce.roblnk.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;

import static com.ecomerce.roblnk.util.PageUtil.ADMIN_USER_NAME;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/")
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatUserService chatUserService;

    @GetMapping("/messages")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> findChatMessages(Principal principal, @RequestParam(value = "recipientId") String recipientId){
        var user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        if (user != null) {
            var senderId = "admin1";

            for (Role role : user.getRoles()){
                if (role.getRole().equals("ROLE_USER")) {
                    senderId = user.getChatUser().getId();
                    recipientId = ADMIN_USER_NAME;
                    break;
                }
                break;
            }
            System.out.println("da vao dc findChatMessages");
            return ResponseEntity.ok(messageService.findMessages(senderId, recipientId));
        }
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ErrorResponse.builder()
                            .statusCode(400)
                            .message("Bad request, please login first!")
                            .description("Bad request, please login first!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build()
            );
    }

    @MessageMapping("/user")
    public void processMessage(@Payload MessageRequest message){
        log.info("message: {}", message.getSenderId());
        log.info("sender: {}", message.getRecipientId());
        log.info("recipient: {}", message.getContent());
        messageService.save(message);
        if (message.getRecipientId().equals(ADMIN_USER_NAME))
            messagingTemplate.convertAndSendToUser(message.getSenderId(), "/queue/messages", message);
        else
            messagingTemplate.convertAndSendToUser(message.getRecipientId(), "/queue/messages", message);
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
    @PreAuthorize("hasRole('ROLE_ADMINISTRATOR')")
    public ResponseEntity<?> getConnectedChatUsers(){
        return ResponseEntity.ok(chatUserService.getAllChatUsersNotContainingAdmin(ADMIN_USER_NAME));
    }
}
