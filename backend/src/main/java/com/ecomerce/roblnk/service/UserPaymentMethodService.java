package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.model.UserPaymentMethod;

import java.security.Principal;
import java.util.List;

public interface UserPaymentMethodService {
    List<UserPaymentMethod> getAllUserPaymentMethod(Long userId);
}
