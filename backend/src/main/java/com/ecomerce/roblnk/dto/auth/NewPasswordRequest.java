package com.ecomerce.roblnk.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewPasswordRequest {
    private String email;
    private String newPassword;
    private String newPasswordConfirm;
    private String oneTimePassword;
}
