package com.ecomerce.roblnk.dto.cart;

import com.ecomerce.roblnk.dto.cartItem.CartItemEditRequest;
import lombok.*;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CartEditRequest {
    private List<CartItemEditRequest> cartItems;
}
