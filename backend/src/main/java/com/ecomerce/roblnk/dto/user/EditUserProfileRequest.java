package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EditUserProfileRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private MultipartFile avatar;
}
