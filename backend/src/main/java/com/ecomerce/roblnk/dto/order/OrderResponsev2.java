package com.ecomerce.roblnk.dto.order;

import com.ecomerce.roblnk.dto.user.AddressDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor

public class OrderResponsev2 {
    private Long id;
    private Integer totalPayment;
    private Integer totalItem;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateAt;
    private UserDTO user;
    private AddressDTO address;
    private PaymentMethodDTO userPaymentMethod;
    private DeliveryDTO delivery;
    private String statusOrder;
    private Integer finalPayment;
}
