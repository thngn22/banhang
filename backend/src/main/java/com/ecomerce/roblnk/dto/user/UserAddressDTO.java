package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class UserAddressDTO {
    private AddressDTO address;
    private boolean isDefault;
}
