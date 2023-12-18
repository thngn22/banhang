package com.ecomerce.roblnk.dto.user;
import lombok.*;


@Getter
@Setter
public class UserAddressResponse {
    private AddressDTO address;
    private boolean isDefault;
}
