package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductItemDTORequest {
    private Long id;
    private Integer price;
    private Integer warehousePrice;
    private Integer numberQuantity;
    private Integer quantityInStock;
    private MultipartFile productImage;
    private boolean active;
    private String size;
    private String color;
}
