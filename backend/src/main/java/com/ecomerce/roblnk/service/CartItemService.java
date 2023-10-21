package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.exception.CartItemException;
import com.ecomerce.roblnk.exception.UserException;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.Product;

public interface CartItemService {
    CartItem createCartItem(CartItem cartItem);
    CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws CartItemException, UserException;
    CartItem isCartItemExist(Cart cart, Product product, String size, Long userId);
    void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException;
    CartItem findCartItemById(Long cartItemId) throws CartItemException;
}
