package com.ecomerce.roblnk.dto.cart;

import lombok.*;
import org.springframework.format.annotation.NumberFormat;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAddressRequestv2 {
    private String city;
    private String district;
    private String ward;
    private String address;
}
