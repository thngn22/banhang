package com.ecomerce.roblnk.dto.cartItem;

import com.ecomerce.roblnk.dto.product.ProductItemCartDTO;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CartItemDTO {
    private Long id;
    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private ProductItemCartDTO productItem;
}
