package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.message.MessageResponse;
import com.ecomerce.roblnk.model.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(source = "chatRoomId.id", target = "chatRoomId")
    @Mapping(source = "senderId.id", target = "senderId")
    @Mapping(source = "recipientId.id", target = "recipientId")
    MessageResponse toMessageResponse(Message message);

    List<MessageResponse> toMessageResponseList(List<Message> messages);
}
