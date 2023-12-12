package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.variationOption.VariationOptionResponse;
import com.ecomerce.roblnk.model.VariationOption;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VariationOptionMapper {
    VariationOptionResponse toVariationOptionResponse(VariationOption variationOption);
    List<VariationOptionResponse> toVariationOptionResponses(List<VariationOption> variationOptions);
}
