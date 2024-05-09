package com.ecomerce.roblnk.dto.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;

@Data
public class EditUserProfileRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private MultipartFile avatar;
}
