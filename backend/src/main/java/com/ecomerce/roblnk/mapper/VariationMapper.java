package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.category.VariationResponse;
import com.ecomerce.roblnk.model.Variation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VariationMapper {

    @Mapping(source = "category.id", target = "categoryId")
    VariationResponse toResponse(Variation variation);
    List<VariationResponse> toVariationResponses(List<Variation> variations);
}
