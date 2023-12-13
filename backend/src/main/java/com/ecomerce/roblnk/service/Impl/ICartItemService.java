package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.mapper.CartMapper;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.repository.CartItemRepository;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.service.CartItemService;
import com.ecomerce.roblnk.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ICartItemService implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;

    @Override
    public CartItem getCartItem(Long id) {
        var cartItem = cartItemRepository.findById(id);
        return cartItem.orElse(null);
    }
}
