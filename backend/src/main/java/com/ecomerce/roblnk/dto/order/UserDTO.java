package com.ecomerce.roblnk.dto.order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;

}
