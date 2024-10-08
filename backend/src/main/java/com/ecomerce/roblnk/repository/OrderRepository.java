package com.ecomerce.roblnk.repository;

import com.ecomerce.roblnk.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long>, JpaSpecificationExecutor<Orders> {
    List<Orders> findAllByUser_Email(String user_email);
    List<Orders> findAllByUpdateAtBetween(Date updateAt, Date updateAt2);
    List<Orders> findAllByCreatedAtBetween(Date updateAt, Date updateAt2);
    Optional<Orders> findOrdersByUser_EmailAndId(String user_email, Long id);
}
