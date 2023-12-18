package com.ecomerce.roblnk.dto.product;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PageProductResponse {
    private Integer pageNumber;
    private Integer pageSize;
    private Integer totalPage;
    private Long totalElements;
    private List<ProductResponse> contents;
}
