package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.exception.CartItemException;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.Product;

public interface CartItemService {
    CartItem getCartItem(Long id);

}
