package com.ecomerce.roblnk.dto;

import com.ecomerce.roblnk.dto.product.ProductResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PageResponse {
    private Integer pageNumber;
    private Integer pageSize;
    private Integer totalPage;
    private Long totalElements;
    private List<?> contents;
}
