package com.ecomerce.roblnk.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdatePasswordRequest {
    private String email;
    private String password;
    private String newPassword;
}
