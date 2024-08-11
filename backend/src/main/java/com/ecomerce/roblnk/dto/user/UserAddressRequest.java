package com.ecomerce.roblnk.dto.user;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserAddressRequest {
    private String city;
    private String district;
    private String ward;
    private String address;
    private Boolean is_default;
}
