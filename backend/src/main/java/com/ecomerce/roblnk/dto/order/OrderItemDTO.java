package com.ecomerce.roblnk.dto.order;

import com.ecomerce.roblnk.model.CartItem;
import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Integer quantity;
    private Integer price;
    private Integer totalPrice;
}
