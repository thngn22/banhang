package com.ecomerce.roblnk.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpRequest {

    @Email
    private String email;
    @NotBlank
    private String oneTimePassword;
}
