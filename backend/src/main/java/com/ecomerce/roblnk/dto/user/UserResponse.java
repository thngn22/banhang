package com.ecomerce.roblnk.dto.user;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private boolean isEmailActive;
    private boolean isActive;
    private String phone;

}
