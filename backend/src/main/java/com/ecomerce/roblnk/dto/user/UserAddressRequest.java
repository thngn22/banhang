package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class    UserAddressRequest {
    private String city;
    private String district;
    private String ward;
    private String address;
    private boolean _default;
}
