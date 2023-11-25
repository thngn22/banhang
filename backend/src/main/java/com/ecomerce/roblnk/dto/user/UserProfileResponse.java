package com.ecomerce.roblnk.dto.user;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String userName;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private boolean isEmailActive;
    private boolean isPhoneActive;
    private String avatar;
}
