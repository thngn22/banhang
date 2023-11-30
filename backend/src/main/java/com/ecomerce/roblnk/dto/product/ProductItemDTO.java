package com.ecomerce.roblnk.dto.product;

import com.ecomerce.roblnk.model.ProductConfiguration;
import com.ecomerce.roblnk.model.VariationOption;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
public class ProductItemDTO {
    private Long id;
    private Double price;
    private Long quantityInStock;
    private String productImage;
    private boolean active;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date modifiedDate;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdDate;
    private List<ProductConfigurationDTO> productConfigurations;

}
