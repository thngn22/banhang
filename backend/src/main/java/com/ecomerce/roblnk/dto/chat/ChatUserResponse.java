package com.ecomerce.roblnk.dto.chat;

import com.ecomerce.roblnk.model.Role;
import com.ecomerce.roblnk.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatUserResponse {

    private String id;
    private String fullName;
    private String roles;
    private String avatar;
    private Long userId;

    public void setRoles(Set<Role> roles) {
        for (Role current : roles) {
            if (!current.getRole().isEmpty()) {
                this.roles = current.getRole();
                break;
            }
        }
    }
}
