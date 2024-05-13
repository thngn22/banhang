package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EditUserProfileRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private ByteMultipartFile avatar;
}
