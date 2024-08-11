package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    List<ChatRoom> findBySenderId_IdAndRecipientId_Id(String senderId_id, String recipientId_id);
}
