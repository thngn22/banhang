package com.ecomerce.roblnk.mapper;

import com.ecomerce.roblnk.dto.cart.PaymentMethodResponse;
import com.ecomerce.roblnk.dto.order.PaymentMethodDTO;
import com.ecomerce.roblnk.model.PaymentMethod;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMethodMapper {

    PaymentMethodResponse toPaymentMethodResponse(PaymentMethod paymentMethod);

    List<PaymentMethodResponse> toPaymentMethodResponses(List<PaymentMethod> paymentMethods);
}
