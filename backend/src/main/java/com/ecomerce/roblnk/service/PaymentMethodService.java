package com.ecomerce.roblnk.service;

import com.ecomerce.roblnk.dto.cart.PaymentMethodResponse;
import com.ecomerce.roblnk.dto.order.PaymentMethodDTO;
import com.ecomerce.roblnk.model.PaymentMethod;

import java.security.Principal;
import java.util.List;

public interface PaymentMethodService {

    List<PaymentMethodResponse> getAllPaymentMethod(Principal principal);
    PaymentMethod getPaymentEntity(Long id);

}
