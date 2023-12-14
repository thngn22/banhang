package com.ecomerce.roblnk.dto.cartItem;

import com.ecomerce.roblnk.dto.product.ProductItemCartDTO;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class CartItemDTO {
    private Long id;
    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private ProductItemCartDTO productItem;
}
