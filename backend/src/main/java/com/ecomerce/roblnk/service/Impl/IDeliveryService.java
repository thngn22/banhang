package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.order.DeliveryDTO;
import com.ecomerce.roblnk.mapper.DeliveryMapper;
import com.ecomerce.roblnk.model.Delivery;
import com.ecomerce.roblnk.repository.DeliveryRepository;
import com.ecomerce.roblnk.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IDeliveryService implements DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final DeliveryMapper deliveryMapper;
    @Override
    public List<DeliveryDTO> getAllDelivery(Principal principal) {
        var deliveries = deliveryRepository.findAll();
        return deliveryMapper.toDeliveryResponses(deliveries);
    }

    @Override
    public Delivery getDeliveryEntity(Long id) {
        var delivery = deliveryRepository.findById(id);
        return delivery.orElse(null);
    }
}
