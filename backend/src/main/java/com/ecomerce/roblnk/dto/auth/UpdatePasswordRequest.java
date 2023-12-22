package com.ecomerce.roblnk.dto.auth;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdatePasswordRequest {
    @Email
    private String email;
    private String password;
    private String newPassword;
    private String newPasswordConfirm;
    private String oneTimePassword;
}
