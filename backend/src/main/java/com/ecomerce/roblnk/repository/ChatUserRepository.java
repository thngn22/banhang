package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.ChatUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatUserRepository extends JpaRepository<ChatUser, String> {
    List<ChatUser> findChatUserByChatRoomsNotEmptyAndIdNotContaining(String id);
}
