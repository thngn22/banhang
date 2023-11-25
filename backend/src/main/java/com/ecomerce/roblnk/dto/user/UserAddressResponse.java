package com.ecomerce.roblnk.dto.user;
import lombok.*;


@Data
public class UserAddressResponse {
    private AddressDTO address;
    private boolean isDefault;
}
