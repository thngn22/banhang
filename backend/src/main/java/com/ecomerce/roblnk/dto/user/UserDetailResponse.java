package com.ecomerce.roblnk.dto.user;

import com.ecomerce.roblnk.model.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class UserDetailResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
    private Date dob;
    private String gender;
    private boolean isEmailActive;
    private boolean isPhoneActive;
    private boolean isActive;
    private String avatar;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private Date createdAt;
    private Set<Role> roles;
}
