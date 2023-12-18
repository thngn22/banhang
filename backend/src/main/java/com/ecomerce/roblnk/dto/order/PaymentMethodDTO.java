package com.ecomerce.roblnk.dto.order;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor

public class PaymentMethodDTO {
    private Long id;
    private String nameMethod;
    private Long paymentMethodId;
}
