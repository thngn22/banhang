package com.ecomerce.roblnk.dto.chat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class MessageRequest {

    private String senderId;
    private String recipientId;
    private String content;

}
