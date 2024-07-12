package com.ecomerce.roblnk.dto.user;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EditUserAddressRequest {
    private Long id;
    private String city;
    private String district;
    private String ward;
    private String address;
    private boolean _default;
}
