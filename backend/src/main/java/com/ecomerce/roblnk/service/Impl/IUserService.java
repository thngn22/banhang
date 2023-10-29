package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.security.JwtService;
import com.ecomerce.roblnk.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("IUserService")
@AllArgsConstructor
public class IUserService implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() ->
                new UsernameNotFoundException("User not found with ID: "+ userId));

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

}
