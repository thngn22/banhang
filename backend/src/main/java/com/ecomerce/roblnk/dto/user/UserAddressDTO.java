package com.ecomerce.roblnk.dto.user;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAddressDTO {
    private AddressDTO address;
    private boolean isDefault;
}
