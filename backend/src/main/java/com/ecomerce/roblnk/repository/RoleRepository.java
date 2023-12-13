package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findRoleByRole(String role);
}
