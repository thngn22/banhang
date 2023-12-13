package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    List<UserAddress> findAllByUser_Email(String user_email);
    Optional<UserAddress> findUserAddressByAddress_IdAndUser_Email(Long address_id, String user_email);
}
