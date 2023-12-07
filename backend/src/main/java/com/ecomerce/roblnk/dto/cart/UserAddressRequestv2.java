package com.ecomerce.roblnk.dto.cart;

import com.ecomerce.roblnk.dto.order.PaymentMethodDTO;
import com.ecomerce.roblnk.model.PaymentMethod;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.NumberFormat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAddressRequestv2 {
    private String city;
    private String streetAddress;
    private String zipCode;

}
