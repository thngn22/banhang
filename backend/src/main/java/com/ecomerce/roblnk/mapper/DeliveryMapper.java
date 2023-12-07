package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.order.DeliveryDTO;
import com.ecomerce.roblnk.model.Delivery;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeliveryMapper {

    DeliveryDTO toDeliveryResponse(Delivery delivery);
    List<DeliveryDTO> toDeliveryResponses(List<Delivery> deliveries);
}
