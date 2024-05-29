package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.chat.ChatUserResponse;
import com.ecomerce.roblnk.model.ChatUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.roles", target = "roles")
    ChatUserResponse toChatUserResponse(ChatUser chatUser);

    List<ChatUserResponse> toChatUserResponseList(List<ChatUser> chatUsers);
}
