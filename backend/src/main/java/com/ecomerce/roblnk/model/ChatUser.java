package com.ecomerce.roblnk.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatUser {

    @Id
    private String id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "avatar")
    private String avatar;

    //User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    //ChatRoom
    @OneToMany(mappedBy = "senderId", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ChatRoom> chatRooms = new ArrayList<>();

    //Message
    @OneToMany(mappedBy = "senderId", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();

}
