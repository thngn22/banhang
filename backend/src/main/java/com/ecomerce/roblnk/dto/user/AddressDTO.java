package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
    private String city;
    private String streetAddress;
    private String zipCode;
}
