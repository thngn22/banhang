package com.ecomerce.roblnk.dto.user;
import lombok.*;


@Getter
@Setter
public class UserAddressResponse {
    private AddressDTO addressInfor;
    private boolean isDefault;
}
