package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    User findUserById(Long userId) throws UserException;
    User findUserProfileByJwt(String jwt) throws UserException;
    Page<User> getAllUsers(Pageable pageable);

}