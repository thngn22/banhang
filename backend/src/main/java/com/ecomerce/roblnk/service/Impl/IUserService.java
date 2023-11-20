package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.user.UserInformationResponse;
import com.ecomerce.roblnk.dto.user.UserResponse;
import com.ecomerce.roblnk.mapper.UserMapper;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.security.JwtService;
import com.ecomerce.roblnk.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("IUserService")
@AllArgsConstructor
public class IUserService implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public UserInformationResponse findUserById(Long userId) {
        var user = userRepository.findById(userId).orElseThrow(() ->
                new UsernameNotFoundException("User not found with ID: "+ userId));
        return userMapper.toInformationResponse(user);
    }

    @Override
    public User findUserProfileByJwt(String jwt) {
        String email = jwtService.getEmailFromToken(jwt);
        return userRepository.findByEmail(email).orElseThrow(()
                -> new UsernameNotFoundException("User not found!"));
    }


    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        var userList = userRepository.findAll();
        return userMapper.toListUserResponse(userList);
    }

}
