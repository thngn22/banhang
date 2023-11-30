package com.ecomerce.roblnk.dto.user;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class EditUserProfileRequest {
    private String userName;
    private String firstName;
    private String lastName;
    private Date dob;
    private String avatar;
}
