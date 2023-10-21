package com.ecomerce.roblnk.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class PaymentDetail {

    private String paymentMethod;
    private String status;
}
