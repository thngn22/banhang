package com.ecomerce.roblnk.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String userName;
    private String email;
    private boolean isEmailActive;
    private String phone;

}
