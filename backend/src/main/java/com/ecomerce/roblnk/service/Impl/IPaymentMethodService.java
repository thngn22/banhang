package com.ecomerce.roblnk.service.Impl;

import com.ecomerce.roblnk.dto.cart.PaymentMethodResponse;
import com.ecomerce.roblnk.mapper.PaymentMethodMapper;
import com.ecomerce.roblnk.model.PaymentMethod;
import com.ecomerce.roblnk.repository.PaymentMethodRepository;
import com.ecomerce.roblnk.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IPaymentMethodService implements PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMethodMapper paymentMethodMapper;
    @Override
    public List<PaymentMethodResponse> getAllPaymentMethod(Principal principal) {
        var paymentMethods = paymentMethodRepository.findAll();
        return paymentMethodMapper.toPaymentMethodResponses(paymentMethods);
    }

    @Override
    public PaymentMethod getPaymentEntity(Long id) {
        var paymentMethodEntity = paymentMethodRepository.findById(id);
        return paymentMethodEntity.orElse(null);
    }

}
