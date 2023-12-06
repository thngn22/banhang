package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.UserPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPaymentMethodRepository extends JpaRepository<UserPaymentMethod, Long> {
    List<UserPaymentMethod> findAllByPaymentMethod_Id(Long paymentMethod_id);
    List<UserPaymentMethod> findAllByUser_Email(String user_email);
    Optional<UserPaymentMethod> findAllByCardNumberContainingIgnoreCase(String cardNumber);
}
