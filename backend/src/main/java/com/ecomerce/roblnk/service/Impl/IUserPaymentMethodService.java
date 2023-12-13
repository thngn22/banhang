package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.model.UserPaymentMethod;
import com.ecomerce.roblnk.repository.UserPaymentMethodRepository;
import com.ecomerce.roblnk.service.UserPaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IUserPaymentMethodService implements UserPaymentMethodService {
    private final UserPaymentMethodRepository userPaymentMethodRepository;
    @Override
    public List<UserPaymentMethod> getAllUserPaymentMethod(Long id) {
        return userPaymentMethodRepository.findAllByUser_Id(id);
    }
}
