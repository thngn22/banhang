package com.ecomerce.roblnk.dto.cartItem;

import com.ecomerce.roblnk.dto.product.ProductItemCartDTO;
import com.ecomerce.roblnk.dto.product.ProductItemDTO;
import com.ecomerce.roblnk.model.ProductItem;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CartItemDTO {
    private Long id;
    private Integer quantity;
    private Double price;
    private ProductItemCartDTO productItem;
}
