package com.ecomerce.roblnk.dto.order;

import lombok.*;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentMethodDTO {
    private Long id;
    private String nameMethod;
    private Long paymentMethodId;
}
