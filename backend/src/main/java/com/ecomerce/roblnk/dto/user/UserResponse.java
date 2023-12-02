package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private boolean isEmailActive;
    private boolean isActive;
    private String phone;

}
