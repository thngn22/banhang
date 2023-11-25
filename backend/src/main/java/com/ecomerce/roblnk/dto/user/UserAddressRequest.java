package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class UserAddressRequest {
    private String city;
    private String streetAddress;
    private String zipCode;
}
