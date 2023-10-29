package com.ecomerce.roblnk.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInformationResponse {
    private String userName;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private boolean isEmailActive;
    private boolean isPhoneActive;
    private String avatar;
}
