package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.variationOption.VariationOptionResponse;
import com.ecomerce.roblnk.model.VariationOption;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-13T02:44:55+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.8 (Oracle Corporation)"
)
@Component
public class VariationOptionMapperImpl implements VariationOptionMapper {

    @Override
    public VariationOptionResponse toVariationOptionResponse(VariationOption variationOption) {
        if ( variationOption == null ) {
            return null;
        }

        VariationOptionResponse variationOptionResponse = new VariationOptionResponse();

        variationOptionResponse.setId( variationOption.getId() );
        variationOptionResponse.setValue( variationOption.getValue() );

        return variationOptionResponse;
    }

    @Override
    public List<VariationOptionResponse> toVariationOptionResponses(List<VariationOption> variationOptions) {
        if ( variationOptions == null ) {
            return null;
        }

        List<VariationOptionResponse> list = new ArrayList<VariationOptionResponse>( variationOptions.size() );
        for ( VariationOption variationOption : variationOptions ) {
            list.add( toVariationOptionResponse( variationOption ) );
        }

        return list;
    }
}
