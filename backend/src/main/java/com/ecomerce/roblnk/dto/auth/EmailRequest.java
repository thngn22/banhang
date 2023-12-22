package com.ecomerce.roblnk.dto.auth;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailRequest {
    @Email
    private String email;
}
