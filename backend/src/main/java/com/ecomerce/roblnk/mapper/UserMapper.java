package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.user.UserInformationResponse;
import com.ecomerce.roblnk.dto.user.UserResponse;
import com.ecomerce.roblnk.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserInformationResponse toInformationResponse(User user);
    List<UserResponse> toListUserResponse(List<User> userList);
    UserResponse toUserResponse(User user);
}
