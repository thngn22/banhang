package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.category.VariationResponse;
import com.ecomerce.roblnk.model.Category;
import com.ecomerce.roblnk.model.Variation;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:56+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class VariationMapperImpl implements VariationMapper {

    @Override
    public VariationResponse toResponse(Variation variation) {
        if ( variation == null ) {
            return null;
        }

        VariationResponse variationResponse = new VariationResponse();

        variationResponse.setCategoryId( variationCategoryId( variation ) );
        variationResponse.setId( variation.getId() );
        variationResponse.setName( variation.getName() );

        return variationResponse;
    }

    @Override
    public List<VariationResponse> toVariationResponses(List<Variation> variations) {
        if ( variations == null ) {
            return null;
        }

        List<VariationResponse> list = new ArrayList<VariationResponse>( variations.size() );
        for ( Variation variation : variations ) {
            list.add( toResponse( variation ) );
        }

        return list;
    }

    private Long variationCategoryId(Variation variation) {
        if ( variation == null ) {
            return null;
        }
        Category category = variation.getCategory();
        if ( category == null ) {
            return null;
        }
        Long id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
