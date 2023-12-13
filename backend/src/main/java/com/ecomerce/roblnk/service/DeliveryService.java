package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.order.DeliveryDTO;
import com.ecomerce.roblnk.model.Delivery;

import java.security.Principal;
import java.util.List;

public interface DeliveryService {
    List<DeliveryDTO> getAllDelivery(Principal principal);
    Delivery getDeliveryEntity(Long id);
}
