package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.ApiResponse;
import com.ecomerce.roblnk.dto.cart.UserCart;
import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import com.ecomerce.roblnk.exception.ErrorResponse;
import com.ecomerce.roblnk.mapper.CartMapper;
import com.ecomerce.roblnk.model.Cart;
import com.ecomerce.roblnk.model.CartItem;
import com.ecomerce.roblnk.model.ProductItem;
import com.ecomerce.roblnk.repository.CartItemRepository;
import com.ecomerce.roblnk.repository.CartRepository;
import com.ecomerce.roblnk.repository.UserRepository;
import com.ecomerce.roblnk.service.CartItemService;
import com.ecomerce.roblnk.service.CartService;
import com.ecomerce.roblnk.service.ProductItemService;
import com.ecomerce.roblnk.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.ecomerce.roblnk.constants.ErrorMessage.EMAIL_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ICartService implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartItemService cartItemService;
    private final CartMapper cartMapper;
    private final UserRepository userRepository;
    private final ProductItemService productItemService;

    @Override
    public ResponseEntity<?> getUserCart(Principal principal) {
        var user = userRepository.findByEmail(principal.getName());
        if (user.isPresent()) {
            var cart = user.get().getCart();
            if (cart != null) {
                UserCart userCart = cartMapper.toUserCart(cart);
                List<CartItemDTO> list = new ArrayList<>();
                for (CartItemDTO cartItemDTO : userCart.getCartItems()) {
                    if (cartItemDTO.getQuantity() > 0) {
                        list.add(cartItemDTO);
                    }
                }
                userCart.setCartItems(list);
                return ResponseEntity.status(HttpStatus.OK).body(userCart);

            } else return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description("You don't have any items in cart!")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());

        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                .statusCode(404)
                .message(String.valueOf(HttpStatus.NOT_FOUND))
                .description(EMAIL_NOT_FOUND)
                .timestamp(new Date(System.currentTimeMillis()))
                .build());
    }

    @Override
    public ResponseEntity<?> editUserCart(Principal principal, @Valid List<CartItemEditRequest> list) {
        var user = userRepository.findByEmail(principal.getName());
        List<CartItem> cartItems = new ArrayList<>();
        int totalPrice = 0;
        int totalQuantity = 0;
        if (user.isPresent()) {
            var userCart = user.get().getCart();

            for (CartItemEditRequest cartItemEditRequest : list) {
                var productItem = productItemService.getProductItem(cartItemEditRequest.getProductItemId());
                if (productItem != null) {
                    if (productItem.isActive()) {
                        var cartItemsExisted = cartItemRepository.findAllByCart_Id(userCart.getId());
                        if (!cartItemsExisted.isEmpty()) {
                            boolean flag = false;
                            loop:
                            {
                                for (CartItem cartItem : cartItemsExisted) {
                                    if (cartItem.getProductItem().getId().equals(productItem.getId())) {
                                        flag = true;
                                        break loop;
                                    }
                                }
                            }
                            if (flag) {
                                miniLoop:
                                {
                                    for (CartItem cartItem : cartItemsExisted) {
                                        if (cartItem.getProductItem().getId().equals(productItem.getId())) {
                                            if (cartItem.getQuantity() + cartItemEditRequest.getQuantity() > productItem.getQuantityInStock()) {
                                                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                                        .statusCode(403)
                                                        .message(String.valueOf(HttpStatus.FORBIDDEN))
                                                        .description("Quantity is more than in stock!")
                                                        .timestamp(new Date(System.currentTimeMillis()))
                                                        .build());
                                            }
                                            if (cartItem.getQuantity() + cartItemEditRequest.getQuantity() <= 0) {
                                                cartItem.setQuantity(0);
                                                cartItem.setTotalPrice(0);
                                            } else {
                                                cartItem.setQuantity(cartItem.getQuantity() + cartItemEditRequest.getQuantity());
                                                cartItem.setTotalPrice(cartItem.getPrice() * cartItem.getQuantity());
                                            }
                                            cartItem.setPrice(productItem.getPrice());
                                            cartItem = cartItemRepository.save(cartItem);
                                            System.out.println("Gia: " + cartItem.getPrice());
                                            System.out.println("So luong: " + cartItem.getQuantity());
                                            System.out.println(" ");
                                            cartItems.add(cartItem);
                                            break miniLoop;
                                        }
                                    }
                                }
                            } else {
                                CartItem cartItem = new CartItem();
                                cartItem.setCart(userCart);
                                cartItem.setProductItem(productItem);
                                cartItem.setPrice(productItem.getPrice());
                                if (cartItemEditRequest.getQuantity() > productItem.getQuantityInStock()) {
                                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                            .statusCode(403)
                                            .message(String.valueOf(HttpStatus.FORBIDDEN))
                                            .description("Quantity is more than in stock!")
                                            .timestamp(new Date(System.currentTimeMillis()))
                                            .build());
                                }
                                if (cartItemEditRequest.getQuantity() <= 0) {
                                    cartItem.setQuantity(0);
                                    cartItem.setTotalPrice(0);
                                } else {
                                    cartItem.setQuantity(cartItemEditRequest.getQuantity());
                                    cartItem.setTotalPrice(cartItem.getPrice() * cartItemEditRequest.getQuantity());
                                }
                                cartItem.setPrice(productItem.getPrice());
                                cartItem = cartItemRepository.save(cartItem);
                                cartItems.add(cartItem);
                            }
                        } else {
                            CartItem cartItem = new CartItem();
                            cartItem.setCart(userCart);
                            cartItem.setProductItem(productItem);
                            cartItem.setPrice(productItem.getPrice());
                            if (cartItemEditRequest.getQuantity() > productItem.getQuantityInStock()) {
                                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                        .statusCode(403)
                                        .message(String.valueOf(HttpStatus.FORBIDDEN))
                                        .description("Quantity is more than in stock!")
                                        .timestamp(new Date(System.currentTimeMillis()))
                                        .build());
                            }
                            if (cartItem.getQuantity() + cartItemEditRequest.getQuantity() <= 0) {
                                cartItem.setQuantity(0);
                                cartItem.setTotalPrice(0);
                            } else {
                                cartItem.setQuantity(cartItem.getQuantity() + cartItemEditRequest.getQuantity());
                                cartItem.setTotalPrice(cartItem.getPrice() * cartItem.getQuantity());
                            }
                            cartItem.setPrice(productItem.getPrice());
                            cartItem = cartItemRepository.save(cartItem);
                            cartItems.add(cartItem);
                        }

                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                                .statusCode(403)
                                .message(String.valueOf(HttpStatus.FORBIDDEN))
                                .description("Unavailable to add this product! Out of stock!")
                                .timestamp(new Date(System.currentTimeMillis()))
                                .build());
                    }
                } else
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse.builder()
                            .statusCode(403)
                            .message(String.valueOf(HttpStatus.FORBIDDEN))
                            .description("Product not found. Invalid to add this product!")
                            .timestamp(new Date(System.currentTimeMillis()))
                            .build());

                userCart = cartRepository.save(userCart);
                for (CartItem cartItem : userCart.getCartItems()){
                    totalQuantity += cartItem.getQuantity();
                    totalPrice += cartItem.getTotalPrice();
                }
                userCart.setTotalItem(totalQuantity);
                userCart.setTotalPrice(totalPrice);
                cartRepository.save(userCart);
            }
            return ResponseEntity.status(HttpStatus.OK).body(ErrorResponse.builder()
                    .statusCode(200)
                    .message(String.valueOf(HttpStatus.OK))
                    .description("Update cart successfully")
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
        } else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse.builder()
                    .statusCode(404)
                    .message(String.valueOf(HttpStatus.NOT_FOUND))
                    .description(EMAIL_NOT_FOUND)
                    .timestamp(new Date(System.currentTimeMillis()))
                    .build());
    }

}
