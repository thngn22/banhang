package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.exception.CartItemException;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.Product;
import com.ecomerce.roblnk.model.User;
import com.ecomerce.roblnk.repository.CartItemRepository;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.service.CartItemService;
import com.ecomerce.roblnk.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ICartItemService implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final CartRepository cartRepository;

}
