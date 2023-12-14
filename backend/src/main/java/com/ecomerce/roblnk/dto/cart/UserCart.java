package com.ecomerce.roblnk.dto.cart;

import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import com.ecomerce.roblnk.model.CartItem;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserCart {
    private Long id;
    private Long userId;
    private Integer totalPrice;
    private int totalItem;
    private List<CartItemDTO> cartItems;

}
