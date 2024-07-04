package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAllByUser_Email(String user_email);
    List<Address> findAllByUser_Id(Long user_id);
    Optional<Address> findByIdAndUser_Email(Long id, String user_email);
}
