package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestGeneric {
    private ProductRequest productItems;
}
