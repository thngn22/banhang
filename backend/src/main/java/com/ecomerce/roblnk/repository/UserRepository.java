package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByChatUser_Id(String chatUser_id);
    List<User> findAllByCreatedAtBetween(Date createdAt, Date createdAt2);
}
