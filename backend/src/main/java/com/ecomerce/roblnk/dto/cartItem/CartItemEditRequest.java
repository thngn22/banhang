package com.ecomerce.roblnk.dto.cartItem;

import com.ecomerce.roblnk.dto.product.ProductItemCartDTO;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartItemEditRequest {
    private Integer quantity;
    private Long productItemId;
}
