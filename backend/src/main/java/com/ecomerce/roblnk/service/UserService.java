package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.User;

public interface UserService {
    public User findUserById(Long userId) throws UserException;
    public User findUserProfileByJwt(String jwt) throws UserException;
}
