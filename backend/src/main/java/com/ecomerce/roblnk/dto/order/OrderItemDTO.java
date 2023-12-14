package com.ecomerce.roblnk.dto.order;

import com.ecomerce.roblnk.dto.product.ProductItemDTO;
import com.ecomerce.roblnk.dto.product.ProductItemDTOv2;
import com.ecomerce.roblnk.dto.product.ProductItemDTOv3;
import com.ecomerce.roblnk.model.CartItem;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
    private Long productItemId;
    private Long productId;
    private String productItemName;
    private String productItemImage;
    private String size;
    private String color;
}
