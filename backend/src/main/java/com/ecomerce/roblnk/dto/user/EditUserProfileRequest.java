package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.util.ByteMultipartFile;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EditUserProfileRequest {

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private MultipartFile avatar;
}
