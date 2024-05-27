package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {

    @Id
    private String id;

    //ChatUser.sender
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "sender_id")
    private ChatUser senderId;

    //ChatUser.recipient
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "recipient_id")
    private ChatUser recipientId;

    //Message
    @OneToMany(mappedBy = "chatRoomId", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();
}
