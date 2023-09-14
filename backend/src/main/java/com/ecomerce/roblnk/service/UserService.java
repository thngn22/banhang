package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    User findUserById(Long userId) throws UserException;
    User findUserProfileByJwt(String jwt) throws UserException;
}
