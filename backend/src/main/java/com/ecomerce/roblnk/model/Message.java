package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Id
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "timestamp")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date timestamp;

    //ChatRoom
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoomId;

    //ChatUser.sender
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "sender_id")
    private ChatUser senderId;

    //ChatUser.recipient
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "recipient_id")
    private ChatUser recipientId;
}
