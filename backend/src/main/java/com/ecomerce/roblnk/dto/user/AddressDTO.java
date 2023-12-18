package com.ecomerce.roblnk.dto.user;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddressDTO {
    private Long id;
    private String city;
    private String streetAddress;
    private String zipCode;
}
