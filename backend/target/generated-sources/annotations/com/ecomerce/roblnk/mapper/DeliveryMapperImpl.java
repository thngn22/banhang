package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.order.DeliveryDTO;
import com.ecomerce.roblnk.model.Delivery;
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
public class DeliveryMapperImpl implements DeliveryMapper {

    @Override
    public DeliveryDTO toDeliveryResponse(Delivery delivery) {
        if ( delivery == null ) {
            return null;
        }

        DeliveryDTO deliveryDTO = new DeliveryDTO();

        deliveryDTO.setId( delivery.getId() );
        deliveryDTO.setName( delivery.getName() );
        deliveryDTO.setPrice( delivery.getPrice() );
        deliveryDTO.setDescription( delivery.getDescription() );
        deliveryDTO.setEstimatedShippingTime( delivery.getEstimatedShippingTime() );

        return deliveryDTO;
    }

    @Override
    public List<DeliveryDTO> toDeliveryResponses(List<Delivery> deliveries) {
        if ( deliveries == null ) {
            return null;
        }

        List<DeliveryDTO> list = new ArrayList<DeliveryDTO>( deliveries.size() );
        for ( Delivery delivery : deliveries ) {
            list.add( toDeliveryResponse( delivery ) );
        }

        return list;
    }
}
