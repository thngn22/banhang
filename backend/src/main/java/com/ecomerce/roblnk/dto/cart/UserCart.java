package com.ecomerce.roblnk.dto.cart;

import com.ecomerce.roblnk.dto.cartItem.CartItemDTO;
import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import com.ecomerce.roblnk.model.CartItem;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserCart {
    private Long id;
    private Long userId;
    private double totalPrice;
    private int totalItem;
    private List<CartItemDTO> cartItems;

}
