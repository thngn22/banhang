package com.ecomerce.roblnk.dto.user;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EditUserProfileRequest {
    private String userName;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String avatar;
}
