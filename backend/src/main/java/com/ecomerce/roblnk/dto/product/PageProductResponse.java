package com.ecomerce.roblnk.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageProductResponse {
    private Integer pageNumber;
    private Integer pageSize;
    private Integer totalPage;
    private Long totalElements;
    private List<ProductResponse> contents;
}
