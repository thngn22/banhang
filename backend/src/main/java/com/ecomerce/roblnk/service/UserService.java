package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.user.UserInformationResponse;
import com.ecomerce.roblnk.dto.user.UserResponse;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserInformationResponse findUserById(Long userId) throws UserException;
    User findUserProfileByJwt(String jwt) throws UserException;
    Page<User> getAllUsers(Pageable pageable);

    List<UserResponse> getAllUsers();
}
